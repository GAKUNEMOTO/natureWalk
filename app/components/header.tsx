import { signOut } from '@/actions/auth';
import NavigationMenuBar from '@/components/navigation-menu';
import SearchBar from '@/components/searchbar';
import { ToggleMode } from '@/components/toggleMode';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import MobileNav from './mobile-nav';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className='h-16 gap-3 border-b px-6 flex items-center'>
      <Button asChild variant='ghost' className="font-bold text-xl">
        <Link href='/'>
          LOGO
        </Link>
      </Button>
      {user ? (
        <>
          <NavigationMenuBar />
          <span className='flex-1'></span>
          <div className="shadow-md
          ">
            <SearchBar />
          </div>
          <div className='lg:hidden'>
            <MobileNav />
          </div>
          <ToggleMode/>
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
