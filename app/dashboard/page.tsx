'use client';

import React, { useEffect, useState } from 'react';
import NatureCard from '@/components/nature-card';
import { Button } from '@/components/ui/button';
import { getNatures } from '@/data/nature';
import { TagId } from '@/types/tag';

type NatureItem = {
  id: number;
  title: string;
  description: string;
  natureImg: string;
  tags: TagId[];
};

export default function Page() {
  const [natureItems, setNatureItems] = useState<NatureItem[]>([]);


  useEffect(() => {
    async function fetchData() {
      const data = await getNatures();
      console.log(data); // デバッグ用
      setNatureItems(data);
    }
    fetchData();
  }, []);

  return (
    <div className="relative p-12">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">おすすめ</h1>
        <Button variant="ghost">view more</Button>
      </div>
      <div className="flex justify-start px-6 py-4">
        <NatureCard items={natureItems} />
      </div>

      <div className="relative p-12">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">季節限定</h1>
          <Button variant="ghost">view more</Button>
        </div>
        <div className="flex justify-start px-6 py-4">
          <NatureCard items={natureItems}   />
        </div>
      </div>

      <div className="relative p-12">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">関東</h1>
          <Button variant="ghost">view more</Button>
        </div>
        <div className="flex justify-start px-6 py-4">
          <NatureCard items={natureItems}  />
        </div>
      </div>

      <div className="relative p-12">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">東北</h1>
          <Button variant="ghost">view more</Button>
        </div>
        <div className="flex justify-start px-6 py-4">
          <NatureCard items={natureItems} />
        </div>
      </div>
    </div>
  );
}
