'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
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

  const supabase = useMemo(() => createClient(), []);

  const cleanAuth = () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem('session'); // セッション情報も削除
  };

  // 初期セッションの取得
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
          cleanAuth();
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
          
          if (data.session) {
            localStorage.setItem('session', JSON.stringify(data.session));
          }
        }
      } catch (err) {
        console.error('getSession error:', err);
        cleanAuth();
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
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          cleanAuth();
        } else {
          setSession(session);
          setUser(session?.user || null);
          
          if (session) {
            localStorage.setItem('session', JSON.stringify(session));
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
      cleanAuth();
    };
  }, [supabase]);

  // セッション自動更新
  useEffect(() => {
    const handleSessionRefresh = async () => {
      if (session?.refresh_token) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresAt = session.expires_at;
        console.log('Session expires at:', expiresAt);

        if (expiresAt && currentTime >= expiresAt - 5 * 60) {
          try {
            const { data, error } = await supabase.auth.refreshSession({
              refresh_token: session.refresh_token
            });

            if (error) throw error;

            if (data.session) {
              setSession(data.session);
              setUser(data.session.user);
              localStorage.setItem('session', JSON.stringify(data.session));
            }
          } catch (error) {
            console.error('Session refresh error:', error);
            cleanAuth();
          }
        }
      }
    };

    const refreshInterval = setInterval(handleSessionRefresh, 1 * 60 * 1000); // 1分ごとにチェック

    return () => clearInterval(refreshInterval);
  }, [session, supabase]);

  // OAuth コールバック処理
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            localStorage.setItem('session', JSON.stringify(data.session));
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          cleanAuth();
        } finally {
          // クエリパラメータを削除
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleOAuthCallback();
  }, [supabase]);

  const value = useMemo(() => ({
    user,
    session,
    setUser,
    setSession,
    isLoading
  }), [user, session, isLoading]);

  return (
    <AuthContext.Provider value={value}>
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