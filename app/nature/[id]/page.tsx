'use client';

import { getTagLabel } from '@/lib/tag';
import NatureDetailClient from './components/naturedetail';
import { kenTags, seasonTags } from '@/data/tag';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NatureItem } from '@/types/nature';
import { createClient } from '@/lib/supabase/client';
import { getNatureIds } from '@/actions/natures';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const NatureDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [item, setItem] = useState<NatureItem | null>(null);

  useEffect(() => {
    const fetchItem = async (id: string) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('natures')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Fetch error:', error);
        setItem(null);
      } else {
        console.log('Fetched item:', data);
        setItem(data as NatureItem);
      }
    };

    if (id) {
      fetchItem(id);
    }
  }, [id]);

  if (!item) {
    return <div>読み込み中...</div>;
  }


async function generateStaticParams() {
  const ids = await getNatureIds();
  return ids.map((id) => ({ id: id.toString() }));
}

  const placeTags = item.tags.filter((tag: string) => kenTags.some(kenTag => kenTag.id === tag));
  const seasonTagsFiltered = item.tags.filter((tag: string) => seasonTags.some(seasonTag => seasonTag.id === tag));

  return (
    <div className='p-6'>
      <div className='overflow-hidden border mb-2 rounded'>
        <div className='container py-5'>
          <div className='flex justify-between mb-2'>
            <h1 className='text-3xl font-semibold'>{item.title}</h1>
            <div className='flex flex-col'>
              <p className="text-muted-foreground">作成日</p>
              <div className='text-muted-foreground mt-2'>{formatDate(item.createdAt)}</div>
            </div>
          </div>
          <div className='w-full h-96 relative mb-4'>
            <Image
              src={item.natureImg}
              alt="nature image"
              fill
              className="rounded-sm object-contain"
            />
          </div>
          <h3 className="font-bold text-2xl text-muted-foreground border-b-4">魅力</h3>
          <p className='p-3'>
            {item.description}
          </p>

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>場所</h3>
          {placeTags.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}
              </p>
            </div>
          ))}

          <h3 className='font-bold text-2xl text-muted-foreground border-b-4'>シーズン</h3>
          {seasonTagsFiltered.map((tag, index) => (
            <div key={index} className='bg-muted rounded text-xs px-1 py-1.5 mb-6'>
              <p className="text-xl">
                {getTagLabel(tag)}
              </p>
            </div>
          ))}

          <NatureDetailClient item={item} />
        </div>
      </div>
    </div>
  );
};

export default NatureDetail;
