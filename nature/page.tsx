import React from 'react'
import Link from 'next/link';
import { getNatures } from '@/data/nature';

export default async function page() {
    const nature = await getNatures();

    return (
      <div className='p-6'>
        <h1 className='font-bold text-3xl mb-6'>Nature POST</h1>
  
        <div className='grid grid-cols-2 gap-2'>
          {nature?.map((nature) => (
            <div className='border p-2 rounded-lg relative' key={nature.id}>
              <div className='aspect-video bg-muted border rounded-lg mb-2'></div>
              <Link href={`/items/${nature.id}`}>
                  {nature.title}
                  <span className='absolute inset-0'></span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }