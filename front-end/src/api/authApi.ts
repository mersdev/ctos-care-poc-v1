import axios from "axios";
import { ProfileRequest, ProfileResponse } from "../types/profile";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Configure axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types
export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

interface UserMetadata {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}

interface Identity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  identities: Identity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

export interface AuthResponse {
  user: User;
  session: Session;
}

// Authentication API calls
export const authApi = {
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await api.post(`/auth/signup`, data);
    return response.data;
  },

  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await api.post(`/auth/signin`, data);
    return response.data;
  },

  signOut: async (): Promise<void> => {
    await api.post(`/auth/signout`, null);
    localStorage.removeItem("accessToken");
  },
};

// Profile API calls
export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get(`/profile`);
    return response.data;
  },

  createProfile: async (data: ProfileRequest): Promise<ProfileResponse> => {
    const response = await api.post(`/profile`, data);
    return response.data;
  },

  updateProfile: async (
    data: Partial<ProfileRequest>
  ): Promise<ProfileResponse> => {
    const response = await api.put(`/profile`, data);
    return response.data;
  },
};
