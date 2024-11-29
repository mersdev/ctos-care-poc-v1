import axios, { AxiosError } from "axios";
import { KeyManagementService } from "./keyManagementService";

export interface AuthUser {
  id: string;
  email: string;
}

interface ApiError {
  error: string;
  message?: string;
}

interface AuthResponse {
  user: AuthUser;
  token?: string;
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`; // adjust this based on your backend URL

export class AuthService {
  static async signUp(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/signup`, {
        email,
        password,
      });

      if (response.data?.user) {
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        }
        // Initialize encryption keys for the new user
        await KeyManagementService.initializeUserKeys();
        return response.data.user;
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        }
      }
      throw new Error("Failed to sign up. Please try again.");
    }
  }

  static async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/signin`, {
        email,
        password,
      });

      if (response.data?.user) {
        // Store the token if provided
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        }

        // Initialize encryption keys if needed
        await KeyManagementService.initializeUserKeys();

        return response.data.user;
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        }
      }
      throw new Error("Failed to sign in. Please check your credentials.");
    }
  }

  static async signOut(): Promise<void> {
    try {
      await axios.post(`${API_URL}/signout`);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // Always clear local storage and headers
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      KeyManagementService.clearPrivateKey();
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null;
      }

      // Set the token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Use the auth endpoint instead of users endpoint
      const response = await axios.get<AuthResponse>(`${API_URL}/user`);
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 404) {
          // Clear invalid token
          localStorage.removeItem("authToken");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      console.error("Error getting current user:", error);
      return null;
    }
  }
}
