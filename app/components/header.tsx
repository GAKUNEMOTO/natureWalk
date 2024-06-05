import { signOut } from '@/actions/auth';
import NavigationMenuBar from '@/components/navigation-menu';

import { ToggleMode } from '@/components/toggleMode';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import MobileNav from './mobile-nav';
import { useAuth } from '@/context/AuthContext';
import { Leaf, Pencil } from 'lucide-react';
import { Command } from '@/components/command';


const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className='h-16 gap-3 border-b px-6 flex items-center'>
      <Button asChild variant='ghost' className="font-bold text-xl">
        <Link href='/dashboard'>
        <Leaf size={40}/>
        </Link>
      </Button>
      <h2>NaTureHub</h2>
      <span className='flex-1'></span>
      <Button variant='outline' className='p-2'>
        <Link href='/nature'>
          <Pencil size={24} />
        </Link>
      </Button>
      <ToggleMode/>
      <Command/>

      {user ? (
        <>
          <form action={signOut}>
            <Button>
              ログアウト
            </Button>
          </form>
        </>
      ) : (
        <>
          <span className='flex-1'></span>
          <ToggleMode/>
          <Button>
            <Link href='/login'>
              ログイン
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default Header;
