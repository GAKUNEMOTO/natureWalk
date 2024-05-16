import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='h-16 border-t sticky top-full px-6 flex items-center'>
        <Button variant='ghost'>
            <Link href='/'>
                LOGO
            </Link>
        </Button>
        <span className='flex-1'></span>
        <p className="text-muted-foreground">© 2024 GAKU NEMOTO</p>
    </div>
  )
}
