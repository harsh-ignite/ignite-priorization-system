import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
    'Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY\n' +
    'Run "supabase status" to get these values.'
  )
}

// Create and export Supabase client singleton
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
