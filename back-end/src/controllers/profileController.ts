import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { ProfileData } from "../models/types";

export const profileController = {
  async getProfile(req: Request, res: Response) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", req.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Return empty profile if none exists
        return res.json({
          email: req.user.email,
          encrypted_data: "",
          encryption_enabled: true,
          consents: {
            banks: [],
            ssm: true,
            courtRecords: true,
            bankruptcySearch: true,
            registrationOfBusiness: true,
          }
        });
      }
      
      return res.json(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async createProfile(req: Request, res: Response) {
    try {
      const profileData: ProfileData = req.body;
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          ...profileData,
          user_id: req.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const profileData: ProfileData = req.body;
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          ...profileData,
          user_id: req.user.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteProfile(req: Request, res: Response) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", req.user.id);

      if (error) throw error;
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
