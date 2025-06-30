import { createClient } from '@supabase/supabase-js';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { databaseConfig } from '@/config/database';
import { Database } from '@/types/supabase';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  databaseConfig.url,
  databaseConfig.anonKey,
  databaseConfig.options
)

// Create a server-side client
export const createServerClient = (cookieStore: any) => {
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}