'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { NatureItem } from '@/types/nature';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { set } from 'zod';

interface NatureDetailClientProps {
  item: NatureItem;
}

const NatureDetailClient: React.FC<NatureDetailClientProps> = ({ item }) => {
  const { user } = useUser();
  const [countLikes, setCountLikes] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const userId = user?.id;
  const itemId = item.id;

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const {data, error } = await supabase
        .from('likes')
        .select('user_id')
        .eq('user_id', userId)
        .eq('nature_id', itemId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setIsLike(true);
      }
    };

    const fetchLikeCount = async () => {
      const {data, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('nature_id', itemId);
      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCountLikes(countLikes);
      }
    };

    fetchLikeStatus();
    fetchLikeCount();
  }, [userId, itemId, supabase]);

  const handlerLike = async () => {
    if (!userId) {
      return;
    }

    if (isLike) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('nature_id', itemId);
    } else {
      await supabase
        .from('likes')
        .insert({ user_id: userId, nature_id: itemId });
    }

    setIsLike(!isLike);
    setCountLikes((prev) => (isLike ? prev - 1 : prev + 1));
  }

  console.log(item);

  return (
    <div className='flex'>
      <Button variant='outline'>
        <Link href={'/dashboard'}>
          戻る
        </Link>
      </Button>
      <Button variant='ghost' onClick={handlerLike}>
        <Heart size={24} className={isLike ? 'text-red-600 fill-red-600' : 'text-gray-400'} />
        <span className='ml-1'>{countLikes}</span>
      </Button>
      <span className='flex-1'></span>
    </div>
  );
};

export default NatureDetailClient;
