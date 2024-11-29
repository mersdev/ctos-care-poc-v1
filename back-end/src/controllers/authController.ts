import { Request, Response } from "express";
import { supabase } from "../config/supabase.js";

export const AuthController = {
  // Sign up new user
  signUp: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (!user) {
        res.status(400).json({ error: "User creation failed" });
        return;
      }

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  // Sign in user
  signIn: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      if (!user || !session) {
        res.status(401).json({ error: "Sign in failed" });
        return;
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
        },
        token: session.access_token
      });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  },

  // Sign out user
  signOut: async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ message: "Successfully signed out" });
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({ error: "Sign out failed" });
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      if (!user) {
        res.status(401).json({ error: "No user found" });
        return;
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user information" });
    }
  }
};
