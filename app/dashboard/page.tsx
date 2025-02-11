'use client';

import React, { useEffect, useState } from 'react';
import NatureCard from '@/components/nature-card';
import { getNatures } from '@/data/nature';
import { NatureItem } from '@/types/nature';
import { filterRecommend, filterRegion, filterSeason, getCurrentSeason } from '@/fliter/filter_func';


export default function Page() {
  const [natureItems, setNatureItems] = useState<NatureItem[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<NatureItem[]>([]);
  const [seasonalItems, setSeasonalItems] = useState<NatureItem[]>([]);
  const [kantoItems, setKantoItems] = useState<NatureItem[]>([]);
  const [tohokuItems, setTohokuItems] = useState<NatureItem[]>([]);
  const [chubuItems, setChubuItems] = useState<NatureItem[]>([]);
  const [kinkiItems, setKinkiItems] = useState<NatureItem[]>([]);
  const [kyushuItems, setKyushuItems] = useState<NatureItem[]>([]);


  useEffect(() => {
    async function fetchData() {
      const data = await getNatures();
      console.log(data); // デバッグ用

      setNatureItems(data.map(item => ({
        ...item,
        tags: item.tags ?? [],
      })));

      const processedData = data.map(item => ({
        ...item,
        tags: item.tags ?? [],
      }));

      setRecommendedItems(filterRecommend(processedData));
      setSeasonalItems(filterSeason(processedData,getCurrentSeason()));
      setTohokuItems(filterRegion(processedData, "東北"));
      setKantoItems(filterRegion(processedData, "関東"));
      setChubuItems(filterRegion(processedData, "中部"));
      setKinkiItems(filterRegion(processedData, "近畿"));
      setKyushuItems(filterRegion(processedData, "九州"));
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200 p-12 font-popone">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-800 text-center mb-12 ghibli-title">自然の冒険カタログ</h1>
        
        <SectionWithLeaves title="おすすめの冒険" items={recommendedItems} />
        <SectionWithLeaves title="季節限定のさんぽ" items={seasonalItems} />
        <SectionWithLeaves title="東北のさんぽ" items={tohokuItems} />
        <SectionWithLeaves title="関東のさんぽ" items={kantoItems} />
        <SectionWithLeaves title="中部のさんぽ" items={chubuItems} />
        <SectionWithLeaves title="近畿のさんぽ" items={kinkiItems} />
        <SectionWithLeaves title="九州のさんぽ" items={kyushuItems} />
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