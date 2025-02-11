'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { NatureItem } from '@/types/nature';
import { set } from 'zod';

interface NatureDetailClientProps {
  item: NatureItem;
}

const NatureDetailClient: React.FC<NatureDetailClientProps> = ({ item }) => {
  const [countLikes, setCountLikes] = useState(0);
  const [isLike, setIsLike] = useState(false);

  const likeKey = `like-${item.id}`;
  const countLikesKey = `count-likes-${item.id}`;

  useEffect(() => {
    const storedLiked = localStorage.getItem(likeKey);
    const storedCountLikes = localStorage.getItem(countLikesKey);
    if (storedLiked == 'true') {
      setIsLike(true);
      }
    
    if (storedCountLikes) {
      setCountLikes(parseInt(storedCountLikes, 10));
    }

    }, [likeKey]);

  const hadlerLike = () => {
    if (isLike) {
      setIsLike(false);
      const newCountLikes = countLikes - 1;
      setCountLikes((prev) => prev - 1);
      localStorage.removeItem(likeKey);
      localStorage.setItem(countLikesKey, newCountLikes.toString());
    } else {
      setIsLike(true);
      const newCountLikes = countLikes + 1;
      setCountLikes((prev) => prev + 1);
      localStorage.setItem(likeKey, 'true');
      localStorage.setItem(countLikesKey, newCountLikes.toString());
    }
  }

  console.log(item);

  return (
    <div className='flex'>
      <Button variant='outline'>
        <Link href={'/dashboard'}>
          戻る
        </Link>
      </Button>
      <Button variant='ghost' onClick={hadlerLike}>
        <Heart size={24} className={isLike ? 'text-red-600 fill-red-600' : 'text-gray-400'} />
        <span className='ml-1'>{countLikes}</span>
      </Button>
      <span className='flex-1'></span>
    </div>
  );
};

export default NatureDetailClient;
