import { supabaseAdmin } from '@/lib/supabase-admin';

export interface TRPCContext {
  supabase: typeof supabaseAdmin;
}

export async function createContext(): Promise<TRPCContext> {
  return {
    supabase: supabaseAdmin,
  };
}
