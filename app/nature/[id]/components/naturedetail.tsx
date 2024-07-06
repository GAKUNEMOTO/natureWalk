'use client';

import { deleteNatureItem } from '@/actions/natures';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { NatureItem } from '@/types/nature';
import { useRouter } from 'next/navigation';

interface NatureDetailClientProps {
  item: NatureItem;
}

const NatureDetailClient: React.FC<NatureDetailClientProps> = ({ item }) => {
    const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteNatureItem(item.id).then(() => {
        router.push('/dashboard');
      });
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  console.log(item);

  return (
    <div className='flex'>
      <Button variant='outline'>
        <Link href={'/dashboard'}>
          戻る
        </Link>
      </Button>
      <span className='flex-1'></span>
      
    </div>
  );
};

export default NatureDetailClient;
