'use client';

import React, { useEffect, useState } from 'react';
import NatureCard from '@/components/nature-card';
import { Button } from '@/components/ui/button';
import { getNatures } from '@/data/nature';
import { TagId } from '@/types/tag';
import Image from 'next/image';

import { NatureItem } from '@/types/nature';
import { seasonTags } from '@/data/tag';

// 現在の季節を取得する関数
const getCurrentSeason = (): string => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

export default function Page() {
  const [natureItems, setNatureItems] = useState<NatureItem[]>([]);
  const currentSeason = getCurrentSeason();

  useEffect(() => {
    async function fetchData() {
      const data = await getNatures();
      setNatureItems(data.map(item => ({
        createdAt: item.createdAt,
        id: item.id,
        title: item.title,
        description: item.description,
        natureImg: item.natureImg,
        tags: item.tags ?? [],
        likes: item.likes as number ?? 0,
        user_id: item.user_id,
      })));
    }
    fetchData();
  }, []);

  const regions = {
    hokkaido: ['hokkaido'],
    tohoku: ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'],
    kanto: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'],
    chubu: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi'],
    kinki: ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'],
    chugoku: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi'],
    shikoku: ['tokushima', 'kagawa', 'ehime', 'kochi'],
    kyushu: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima'],
    okinawa: ['okinawa']
  };
  
  // 地域名の日本語表示用
  const regionLabels = {
    hokkaido: '北海道',
    tohoku: '東北',
    kanto: '関東',
    chubu: '中部',
    kinki: '近畿',
    chugoku: '中国',
    shikoku: '四国',
    kyushu: '九州',
    okinawa: '沖縄'
  };

  // いいねの多い順に並び替えて上位を取得
  const getFavorites = (items: NatureItem[], limit = 10) => {
    return [...items]
      .sort((a, b) => (Number(b.likes) ?? 0) - (Number(a.likes) ?? 0))
      .slice(0, limit);
  };

  // 季節でフィルタリング
  const getSeasonalItems = (items: NatureItem[]) => {
    return items.filter(item => item.tags.includes(currentSeason));
  };

  // 地域でフィルタリング
  const getRegionalItems = (items: NatureItem[], region: string[]) => {
    return items.filter(item => 
      item.tags.some(tag => region.includes(tag))
    );
  };

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200 p-12 font-popone">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-emerald-800 text-center mb-12 ghibli-title">
            自然の冒険カタログ
          </h1>
          
          {/* いいねの多い記事 */}
          <SectionWithLeaves 
            title="みんなのお気に入り" 
            items={getFavorites(natureItems)} 
          />
  
          {/* 現在の季節の記事 */}
          <SectionWithLeaves 
            title={`${seasonTags.find(s => s.id === currentSeason)?.label}の限定スポット`} 
            items={getSeasonalItems(natureItems)} 
          />
  
          {/* 全地域の記事を表示 */}
          {Object.entries(regions).map(([regionKey, prefectures]) => (
            <SectionWithLeaves
              key={regionKey}
              title={`${regionLabels[regionKey as keyof typeof regionLabels]}の自然`}
              items={getRegionalItems(natureItems, prefectures)}
            />
          ))}
        </div>
      </div>
    );
  }

function SectionWithLeaves({ title, items }: { title: string; items: NatureItem[] }) {
  // アイテムが空の場合はセクションを表示しない
  if (items.length === 0) return null;

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