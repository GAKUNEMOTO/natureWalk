'use client';
import { signOut } from "@/actions/auth";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { LogOut, TrashIcon, UserIcon, UserRoundCheck, UserRoundIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AvatarToggle() {
    const { user } = useAuth();
    const [showAvatar, setShowAvatar] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    useEffect(() => {
        const fetchProfileAvatar = async () => {
          const supabase = createClient();
          const { data, error } = await supabase.from('profiles').select('avatar_url').eq('id', user?.id).single();
          if (error) {
            console.error(error);
          } else if(data?.avatar_url) {
            setAvatarUrl(data?.avatar_url);
          }
        }
        if (user) {
          fetchProfileAvatar();
        }
      }, [user]);

      const handleLogout = async () => {
        try {
          setIsLoading(true);
          setShowAvatar(false);
          
          // ローカルの状態をクリア
          setAvatarUrl(null);
          
          await signOut();
          
          // 必要に応じて追加のクリーンアップ
          window.location.reload(); // 完全なページリロード
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
    return (
        <div className="relative">
        <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200"
            onClick={() => setShowAvatar((prev) => !prev)}
        >
            {avatarUrl ? (
            <img
                src={avatarUrl}
                alt="avatar"
                className="w-10 h-10 rounded-full"
            />
            ) : (
            <UserIcon className="w-6 h-6 text-gray-500" />
            )}
        </button>
        {showAvatar && (
            <div className="absolute top-12 right-0 z-10 w-48 p-2 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-between">
                <button
                className="flex items-center space-x-2 mb-4"
                onClick={() => {
                    setShowAvatar(false);
                    setAvatarUrl(null);
                }}
                >
                <UserRoundCheck className="w-4 h-4 text-green-500"/>
                <Link href="/profile" className="text-sm text-green-500">プロフィールを見る</Link>
                </button>

                <button
                className="flex items-center space-x-2 mb-4"
                onClick={() => setShowAvatar(false)}
                >
                <UserRoundIcon className="w-4 h-4 text-gray-500" />
                <Link href="/profile/edit" className="text-sm text-gray-500">プロフィールを編集</Link>
                </button>

                <button
                    className="flex items-center space-x-2 mb-2"
                    onClick={handleLogout}
                    disabled={isLoading}
                >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">
                        {isLoading ? 'Logging out...' : 'Logout'}
                    </span>
                </button>
            </div>
            </div>
        )}
        </div>
    );
    }