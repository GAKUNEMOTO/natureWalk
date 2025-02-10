import React from 'react';
import { SignIn } from '@clerk/nextjs'
import FallingLeaves from '@/app/animation/fallingleaf';

export default async function SignPage() {
  return (
    <>
    <FallingLeaves count={50} />
    <div className='h-[calc(100vh-96px)] flex items-center justify-center'>
      <SignIn fallbackRedirectUrl={'/dashboard'}/>
    </div>
    </>
  )
}
