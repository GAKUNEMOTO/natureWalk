import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // セッションをローカルストレージ等に保持
      autoRefreshToken: true, // アクセストークン自動更新
      detectSessionInUrl: true,
    },
  },
  )
}