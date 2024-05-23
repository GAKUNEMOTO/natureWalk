'use client';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type NatureItem = {
  id: number;
  title: string;
  description: string;
};

type NatureCardProps = {
  items: NatureItem[];
};

export default function NatureCard({ items }: NatureCardProps) {
  return (
    <Carousel className="w-full relative">
      <CarouselContent className="flex space-x-4">
        {items.map((item) => (
          <CarouselItem key={item.id} className="flex-none w-96">
            <div className="relative p-4 border rounded-md shadow-sm bg-card">
              <div className="aspect-video border relative mb-2 rounded">
                {/* ここに画像などを表示 */}
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <ArrowUpRight className="inline" size={20} />
              <div className="flex relative z-10 flex-wrap mt-2 gap-2">
                {item.description}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
    </Carousel>
  );
}
