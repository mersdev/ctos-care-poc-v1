import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Default to the public Supabase URL and anon key if not provided
const supabaseUrl = process.env.SUPABASE_URL || 'https://jphhixbegyebwpsggylu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaGhpeGJlZ3llYndwc2dneWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MjE0MzgsImV4cCI6MjAyNTE5NzQzOH0.RzdL0nnM0lS9Aq0YnzTcG9TRt5oFaOFXUCRr5lXgGnM';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
