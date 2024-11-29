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
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProfile(req: Request, res: Response) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", req.user.id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
