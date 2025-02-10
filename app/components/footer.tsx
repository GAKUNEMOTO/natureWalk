import { Leaf } from 'lucide-react'
import React from 'react'

export default function Footer() {
  return (
    <div className='h-16 border-t sticky top-full px-6 flex items-center'>
            <Leaf size={40} />
            <h2 className="ml-3">NatureHub</h2>
        <span className='flex-1'></span>
        <p className="text-muted-foreground">© 2024 GAKU NEMOTO</p>
    </div>
  )
}
