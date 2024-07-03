import { signOut } from '@/actions/auth';
import { ToggleMode } from '@/components/toggleMode';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Pencil, LogOut } from 'lucide-react';
import { Command } from '@/components/command';
import { createClient } from '@/lib/supabase/client';
import { NatureItem } from '@/types/nature';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [natureItems, setNatureItems] = useState<NatureItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchNatureItems = async () => {
      const client = createClient();
      const { data, error } = await client.from('natures').select('*');
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
            <form action={signOut}>
              <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white font-popone">
                <LogOut size={20} className="mr-2" />
                冒険を終える
              </Button>
            </form>
          ) : (
            <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white font-popone">
              <Link href='/login'>
                冒険に参加
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;