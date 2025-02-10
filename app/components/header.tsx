import { ToggleMode } from '@/components/toggleMode';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { Leaf, Pencil } from 'lucide-react';
import { Command } from '@/components/command';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header: React.FC = () => {
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
          
          <Command items={[]} /> {/* natureItems を削除 */}

          <ToggleMode />
          
          <SignedIn>
            <UserButton/>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="w-20 inline-block">
              ログイン
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
