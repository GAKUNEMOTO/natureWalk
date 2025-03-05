import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,        // セッションをローカルに保持
        autoRefreshToken: true,      // トークンを自動リフレッシュ
        detectSessionInUrl: true,    // OAuthリダイレクト時のURL検知
      },
    }
  )
}

