'use client';

import React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getTagLabel } from '@/lib/tag';
import { NatureCardProps } from '@/types/nature';
import Image from 'next/image';

export default function NatureCard({ items }: NatureCardProps) {

    function truncateString(text: string, maxLength: number) {
      if(text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      } else {
        return text;
      }
    }
  return (
    <Carousel className="w-full relative">
      <CarouselContent className="flex space-x-4">
        {items.map((item) => (
          <Link key={item.id} href={`/nature/${item.id}`} passHref>
            <CarouselItem className="flex-none w-96 cursor-pointer">
              <div className="relative p-4 border rounded-md shadow-sm bg-card">
                <div className='aspect-video overflow-hidden border relative mb-2 rounded'>
                <Image
                src={item.natureImg}
                alt="nature image"
                layout="fill"
                objectFit="cover"
                className="rounded-sm"
              />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <div className="flex relative z-10 flex-wrap mt-2 gap-2">
                  {item.tags && item.tags.map((tag, index) => (
                    <div key={index} className='border whitespace-nowrap text-muted-foreground bg-muted rounded text-xs px-1 py-1.5'>
                      {getTagLabel(tag)}
                    </div>
                  ))}
                </div>
                <div className="flex relative z-10 flex-wrap mt-2 gap-2">
                  {truncateString(item.description, 50)}
                </div>
              </div>
            </CarouselItem>
          </Link>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
    </Carousel>
  );
}
