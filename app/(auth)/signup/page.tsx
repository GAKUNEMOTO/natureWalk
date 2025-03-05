
import React from 'react'
import { SignUpForm } from './components/signin-form'


export default function Page() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-sky-300 via-green-200 to-yellow-200 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl shadow-xl transform -rotate-6 z-0"></div>
          <div className="relative bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl z-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-popone text-emerald-800 ghibli-title">魔法の入り口</h2>
              <p className="text-emerald-600 mt-2 font-popone">自然の世界へようこそ</p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
  )
}
