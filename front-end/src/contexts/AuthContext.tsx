import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, type AuthResponse } from "@/api/authApi";

// Import the User type from authApi
import type { User } from "@/api/authApi";

interface AuthContextType {
  user: User | null;
  sign_in: (email: string, password: string) => Promise<void>;
  sign_up: (email: string, password: string) => Promise<void>;
  sign_out: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely decode base64
const safeAtob = (str: string): string | null => {
  try {
    // Remove potential URL-safe characters
    const base64 = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid token length');
      }
      const padding = '='.repeat(4 - pad);
      return atob(base64 + padding);
    }
    
    return atob(base64);
  } catch (e) {
    console.error('Base64 decode error:', e);
    return null;
  }
};

// Helper function to decode JWT payload
const decodeJWTPayload = (token: string | null): { sub: string; email: string } | null => {
  if (!token) {
    console.log('No token provided');
    return null;
  }

  try {
    // Split the token and get the payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload
    const decoded = safeAtob(parts[1]);
    if (!decoded) {
      console.error('Failed to decode payload');
      return null;
    }

    // Parse the JSON payload
    const payload = JSON.parse(decoded);
    console.log('Decoded payload:', payload);

    // Extract user ID and email from the payload
    const sub = payload.sub || payload.user_id || payload.id;
    const email = payload.email || payload.preferred_username || payload.username;

    if (!sub || !email) {
      console.error('Missing required claims in payload');
      return null;
    }

    return { sub, email };
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const processAuthResponse = (response: AuthResponse) => {
    if (!response) {
      console.error('No response received');
      return false;
    }

    console.log('Processing auth response:', response);

    // Check if response has the required user data
    if (!response.user?.id || !response.user?.email) {
      console.error('Missing user data in response');
      return false;
    }

    // Check if response has the required session data
    if (!response.session?.access_token) {
      console.error('Missing session data in response');
      return false;
    }

    try {
      // Store the access token
      localStorage.setItem('accessToken', response.session.access_token);
      
      // Set user state with the full user object
      setUser(response.user);
      
      // Validate token (optional)
      const decodedToken = decodeJWTPayload(response.session.access_token);
      if (decodedToken) {
        console.log('Token validation successful:', {
          user: response.user,
          decoded: decodedToken
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error processing auth response:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('No stored token found');
          setUser(null);
          return;
        }

        const decodedToken = decodeJWTPayload(token);
        if (!decodedToken) {
          console.log('Invalid stored token');
          localStorage.removeItem('accessToken');
          setUser(null);
          return;
        }

        // Create a minimal user object from token
        setUser({
          id: decodedToken.sub,
          email: decodedToken.email,
          aud: 'authenticated',
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          confirmation_sent_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: {
            provider: 'email',
            providers: ['email']
          },
          user_metadata: {
            email: decodedToken.email,
            email_verified: false,
            phone_verified: false,
            sub: decodedToken.sub
          },
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_anonymous: false
        });

      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const sign_in = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn({ email, password });
      console.log('Sign in response:', response);
      
      if (!processAuthResponse(response)) {
        throw new Error('Failed to process authentication response');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const sign_up = async (email: string, password: string) => {
    try {
      const response = await authApi.signUp({ email, password });
      console.log('Sign up response:', response);
      
      if (!processAuthResponse(response)) {
        throw new Error('Failed to process authentication response');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const sign_out = async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, sign_in, sign_up, sign_out, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
