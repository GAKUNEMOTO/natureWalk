'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  const supabase = createClient();
  console.log('AuthProvider rendered');
  console.log('User:', user);
  console.log('Session:', session);

  // 最初の useEffect: セッションを取得する
  useEffect(() => {
// getSession() の修正（refreshSession() を削除）
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Session:", session);

        if (error) {
          console.log("Error fetching session:", error.message);
          setIsLoading(false);
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    getSession();
  }, []);

  // 2つ目の useEffect: 認証状態の変更を監視する
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log("✅ User logged in, refreshing session...");
        await supabase.auth.refreshSession(); // 🔥 セッションを明示的に更新
      }
  
      setSession(session);
      setUser(session?.user ?? null);
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code")) {
        console.log("🔄 Handling OAuth callback...");
        const code = urlParams.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
  
    checkOAuthCallback();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, setUser, setSession, isLoading }}>
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