'use client';

import React, { useEffect, useState } from 'react';
import NatureCard from '@/components/nature-card';
import { Button } from '@/components/ui/button';
import { getNatures } from '@/data/nature';
import { TagId } from '@/types/tag';
import Image from 'next/image';

type NatureItem = {
  createdAt: string;
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
      setNatureItems(data.map(item => ({
        ...item,
        tags: item.tags ?? [],
      })));
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200 p-12 font-popone">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-800 text-center mb-12 ghibli-title">自然の冒険カタログ</h1>
        
        <SectionWithLeaves title="おすすめの冒険" items={natureItems} />
        <SectionWithLeaves title="季節限定の魔法" items={natureItems} />
        <SectionWithLeaves title="関東の秘密の場所" items={natureItems} />
        <SectionWithLeaves title="東北の神秘" items={natureItems} />
      </div>
    </div>
  );
}

function SectionWithLeaves({ title, items }: { title: string; items: NatureItem[] }) {
  return (
    <div className="relative mb-16">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">{title}</h2>
        <div className="flex overflow-x-auto pb-4 gap-6">
          <NatureCard items={items} />
        </div>
      </div>
    </div>
  );
}