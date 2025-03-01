'use client';
import { ToggleMode } from '@/components/toggleMode';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Pencil, } from 'lucide-react';
import { Command } from '@/components/command';
import { createClient } from '@/utils/supabase/client';
import { NatureItem } from '@/types/nature';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user } = useAuth();
  console.log("User in Header:", user);
  const [natureItems, setNatureItems] = useState<NatureItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchNatureItems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('natures').select('*');
      if (error) {
        console.error(error);
      } else {
        setNatureItems(data);
      }
    };
    fetchNatureItems();
  }, []);

  if (!isClient) {
    return null;
  }
  
  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href='/dashboard' className="flex items-center space-x-2">
          <Leaf size={40} className="text-white animate-bounce" />
          <h1 className="font-popone text-3xl text-white ghibli-title">NaTureWalk</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Button variant='ghost' className="bg-white/20 hover:bg-white/30 text-white font-popone">
            <Link href='/nature' className="flex items-center">
              <Pencil size={20} className="mr-2" />
              冒険を記録
            </Link>
          </Button>
          
          <Command items={natureItems} />
          
          <ToggleMode />
          
          {user ? (

            <Avatar>
              <Link href='/login'>
              <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="User Avatar" />
              </Link>
            </Avatar>
          ) : (
            <Link href='/login' className="text-white font-popone">ログイン</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;