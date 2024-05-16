'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type NatureCardProps = {
  items: {
    id: number;
    title: string;
    description: string;
    imgUrl: string;
    place: string;
  }[];
};

export default function NatureCard({ items }: NatureCardProps) {
  console.log(items); // デバッグ用

  return (
    <Carousel className="w-full relative">
      <CarouselContent className="flex space-x-4">
        {items.map((item) => (
          <CarouselItem key={item.id} className="flex-none w-96">
            <div className="relative p-4 border rounded-md shadow-sm bg-card">
              <div className="aspect-video border relative mb-2 rounded" style={{ backgroundImage: `url(${item.imgUrl})`, backgroundSize: 'cover' }}></div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="absolute inset-0"></span>
              <ArrowUpRight className="inline" size={20} />
              <div className="flex relative z-10 flex-wrap mt-2 gap-2">
                <Link href="">
                  <p className="border whitespace-nowrap text-muted-foreground bg-muted rounded text-xs px-1 py-1.5">
                    {item.description}
                  </p>
                </Link>
                <Link href="">
                  <p className="border whitespace-nowrap text-muted-foreground bg-muted rounded text-xs px-1 py-1.5">
                    {item.place}
                  </p>
                </Link>
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
