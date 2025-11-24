import { createClient } from '@supabase/supabase-js';

// --- TEMPORARY SOLUTION ---
// TODO: Replace with your project's URL and anon key, then move to a .env file later.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);