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

  useEffect(() => {
    // セッション情報をローカルストレージに保存
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    }
  }, [session]);
  
  // 初期セッション取得時に、ローカルストレージから読み込み
  useEffect(() => {
    const storedSessionStr = localStorage.getItem('session');
    if (storedSessionStr) {
      try {
        const storedSession = JSON.parse(storedSessionStr);
        setSession(storedSession);
        setUser(storedSession?.user || null);
      } catch (error) {
        console.error('Error parsing stored session:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleSessionRefresh = async () => {
      if (session) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresAt = session.expires_at;
  
        // セッション期限が近づいたら自動更新
        if (expiresAt && currentTime >= expiresAt - 5 * 60) { // 5分前
          try {
            const { data, error } = await supabase.auth.refreshSession({
              refresh_token: session.refresh_token
            });
  
            if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
            } else if (error) {
              console.error('Automatic session refresh failed:', error);
              // 必要に応じてログアウト処理
              setSession(null);
              setUser(null);
            }
          } catch (error) {
            console.error('Session refresh error:', error);
          }
        }
      }
    };
  
    // 定期的にセッションをチェック
    const refreshInterval = setInterval(handleSessionRefresh, 5 * 60 * 1000); // 5分ごと
  
    return () => clearInterval(refreshInterval);
  }, [session, supabase]);

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
