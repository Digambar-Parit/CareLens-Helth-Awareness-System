const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables! Check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

// Public client – uses anon key (respects RLS policies)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client – uses service role key (bypasses RLS, server-side only)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : supabase;

module.exports = { supabase, supabaseAdmin };
