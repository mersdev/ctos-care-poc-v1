import axios from "axios";
import { ProfileData } from "../types/profile";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:3001";

const validateProfileData = (profileData: ProfileData): void => {
  // Required fields validation
  if (!profileData.name || !profileData.email) {
    throw new Error("Name and email are required");
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profileData.email)) {
    throw new Error("Invalid email format");
  }

  // IC number format validation (if provided)
  if (profileData.identityCardNumber) {
    const icRegex = /^\d{6}-\d{2}-\d{4}$/;
    if (!icRegex.test(profileData.identityCardNumber)) {
      throw new Error("Invalid IC number format (should be XXXXXX-XX-XXXX)");
    }
  }

  // Date format validation (if provided)
  if (profileData.dateOfBirth) {
    const date = new Date(profileData.dateOfBirth);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format for date of birth");
    }
  }
};

// Utility function to format date to DD-MM-YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return "";
  }
};

// Utility function to parse date from DD-MM-YYYY to YYYY-MM-DD
const parseDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const [day, month, year] = dateString.split('-').map(num => num.trim());
    if (!day || !month || !year) return "";
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

const sanitizeProfileData = (profileData: ProfileData): ProfileData => {
  const sanitized: ProfileData = {
    name: profileData.name.trim(),
    email: profileData.email.trim(),
  };

  // Handle optional string fields
  const optionalStringFields: (keyof Omit<
    ProfileData,
    "name" | "email" | "dateOfBirth" | "identityCardNumber"
  >)[] = ["phone", "address", "nationality", "publicKey", "keyLastUpdated"];

  // Copy and trim optional string fields if they exist
  optionalStringFields.forEach((field) => {
    const value = profileData[field];
    if (typeof value === "string") {
      (sanitized[field] as string | undefined) = value.trim();
    }
  });

  // Special handling for IC number
  if (profileData.identityCardNumber) {
    const formattedIC = profileData.identityCardNumber.replace(/[-\s]/g, "");
    if (formattedIC.length === 12) {
      sanitized.identityCardNumber = `${formattedIC.slice(0, 6)}-${formattedIC.slice(6, 8)}-${formattedIC.slice(8)}`;
    } else {
      sanitized.identityCardNumber = profileData.identityCardNumber.trim();
    }
  }

  // Special handling for date of birth
  if (profileData.dateOfBirth) {
    // Convert from DD-MM-YYYY to YYYY-MM-DD for storage
    sanitized.dateOfBirth = parseDate(profileData.dateOfBirth);
  }

  // Handle boolean fields
  if (typeof profileData.onboardingCompleted === "boolean") {
    sanitized.onboardingCompleted = profileData.onboardingCompleted;
  }
  if (typeof profileData.encryptionEnabled === "boolean") {
    sanitized.encryptionEnabled = profileData.encryptionEnabled;
  }

  // Handle consents object
  if (profileData.consents) {
    sanitized.consents = { ...profileData.consents };
  }

  // Handle ID if present
  if (profileData.id) {
    sanitized.id = profileData.id;
  }

  return sanitized;
};

export class ProfileService {
  static async createProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      const sanitizedData = sanitizeProfileData(profileData);
      validateProfileData(sanitizedData);

      const response = await axios.post(
        `${API_BASE_URL}/api/profiles`,
        sanitizedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Profile creation error:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  static async getProfile(): Promise<ProfileData | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_BASE_URL}/api/profiles/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Map snake_case to camelCase and format date
      const data = response.data;
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        identityCardNumber: data.identity_card_number || "",
        dateOfBirth: data.date_of_birth ? formatDate(data.date_of_birth) : "",
        nationality: data.nationality || "",
        onboardingCompleted: data.onboarding_completed || false,
        encryptionEnabled: data.encryption_enabled || false,
        publicKey: data.public_key || "",
        keyLastUpdated: data.key_last_updated || "",
        consents: data.consents || null
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  static async updateProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const sanitizedData = sanitizeProfileData(profileData);
      validateProfileData(sanitizedData);

      const response = await axios.put(
        `${API_BASE_URL}/api/profiles/current`,
        sanitizedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to update profile: ${errorMessage}`);
      }
      throw error;
    }
  }

  static async deleteProfile(): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`${API_BASE_URL}/api/profiles/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Profile deletion error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to delete profile: ${errorMessage}`);
      }
      throw error;
    }
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile?.onboardingCompleted || false;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }
}
