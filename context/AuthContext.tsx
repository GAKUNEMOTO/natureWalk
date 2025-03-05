'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase クライアントをメモ化して固定する
  const supabase = useMemo(() => createClient(), []);

  // 初期セッションの取得
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
        } else {
          console.log('Initial session:', data.session);
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('getSession error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    getSession();
  }, [supabase]);

  // 認証状態の変更を監視
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        // SIGNED_IN 時にオプションでセッションを更新（必要な場合）
        if (event === 'SIGNED_IN' && session) {
          await supabase.auth.refreshSession();
        }
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // OAuth コールバックのハンドリング
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('code')) {
        console.log('Handling OAuth callback...');
        const code = urlParams.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
        // URL からクエリパラメータを除去
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    handleOAuthCallback();
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ user, session, setUser, setSession, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
