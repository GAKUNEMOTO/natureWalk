'use client';
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import React from 'react'

export default function MobileNav() {
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button size="icon" variant="outline">
          <Menu size={20}/>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <div className="flex flex-col">
        <Button variant='ghost'>
          Home
        </Button>
        <Button variant='ghost'>
          Home
        </Button>
        <Button variant='ghost'>
          Home
        </Button>
        <Button variant='ghost'>
          Home
        </Button>
        <Button variant='ghost'>
          Home
        </Button>
        <Button variant='ghost'>
          Home
        </Button>
      </div>
      
    </SheetContent>
  </Sheet>
  )
}
