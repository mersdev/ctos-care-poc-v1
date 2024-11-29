import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const authController = {
  async signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async signOut(req: Request, res: Response) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      res.status(200).json({ message: "Signed out successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async resetPassword(req: Request, res: Response) {
    const { email } = req.body;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      res.json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
