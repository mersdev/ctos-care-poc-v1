import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { ProfileData } from "../models/profile.js";

export const ProfileController = {
  // Current user profile handlers
  getCurrentProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      if (!data) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("Error getting current profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateCurrentProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profileData: ProfileData = req.body;
      
      // Validate required fields
      if (!profileData.name || !profileData.email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is the "not found" error code
        console.error("Error checking existing profile:", fetchError);
        res.status(500).json({ error: fetchError.message });
        return;
      }

      let result;
      if (!existingProfile) {
        // Create new profile if it doesn't exist
        result = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            identity_card_number: profileData.identityCardNumber,
            date_of_birth: profileData.dateOfBirth,
            nationality: profileData.nationality,
            onboarding_completed: profileData.onboardingCompleted,
            encryption_enabled: profileData.encryptionEnabled,
            public_key: profileData.publicKey,
            key_last_updated: profileData.keyLastUpdated,
            consents: profileData.consents
          })
          .select()
          .single();
      } else {
        // Update existing profile
        result = await supabase
          .from("profiles")
          .update({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            identity_card_number: profileData.identityCardNumber,
            date_of_birth: profileData.dateOfBirth,
            nationality: profileData.nationality,
            onboarding_completed: profileData.onboardingCompleted,
            encryption_enabled: profileData.encryptionEnabled,
            public_key: profileData.publicKey,
            key_last_updated: profileData.keyLastUpdated,
            consents: profileData.consents
          })
          .eq("user_id", userId)
          .select()
          .single();
      }

      if (result.error) {
        console.error("Error updating/creating profile:", result.error);
        res.status(500).json({ error: result.error.message });
        return;
      }

      res.json(result.data);
    } catch (error) {
      console.error("Error updating current profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteCurrentProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting current profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profileData: ProfileData = req.body;
      
      // Validate required fields
      if (!profileData.name || !profileData.email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          identity_card_number: profileData.identityCardNumber,
          date_of_birth: profileData.dateOfBirth,
          nationality: profileData.nationality,
          onboarding_completed: profileData.onboardingCompleted,
          encryption_enabled: profileData.encryptionEnabled,
          public_key: profileData.publicKey,
          key_last_updated: profileData.keyLastUpdated,
          consents: profileData.consents
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(201).json(data);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // From auth middleware

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      if (!data) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profileData: ProfileData = req.body;
      
      // Validate required fields
      if (!profileData.name || !profileData.email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is the "not found" error code
        console.error("Error checking existing profile:", fetchError);
        res.status(500).json({ error: fetchError.message });
        return;
      }

      if (!existingProfile) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          identity_card_number: profileData.identityCardNumber,
          date_of_birth: profileData.dateOfBirth,
          nationality: profileData.nationality,
          onboarding_completed: profileData.onboardingCompleted,
          encryption_enabled: profileData.encryptionEnabled,
          public_key: profileData.publicKey,
          key_last_updated: profileData.keyLastUpdated,
          consents: profileData.consents
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id; // From auth middleware

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
