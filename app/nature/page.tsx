
import React from 'react'
import NatureForm from './components/nature-post-form'
import { currentUser } from '@/data/auth'
import { redirect } from 'next/navigation';

export default function page() {
  const user = currentUser();

  if(!user){
    redirect('/login');
  }

  
  return (
    <div className='p-6'>
      <h1 className='font-bold text-3xl'>自然シェア</h1>
      <NatureForm/>
    </div>
  )
}
