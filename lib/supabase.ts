import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Coffee = {
  id: string
  name: string
  roaster: string | null
  mahlgrad: number
  notizen: string | null
  created_at: string
  updated_at: string
}

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your-supabase-url') {
    throw new Error('Supabase not configured')
  }
  _supabase = createClient(url, key)
  return _supabase
}
