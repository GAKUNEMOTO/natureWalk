import React from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardDescription,
} from "@/components/ui/card";

const FallingLeaves = dynamic(() => import('@/app/animation/fallingleaf'), { ssr: false });

const Home: React.FC = () => {
  return (
    <main className="bg-green-200 w-screen h-screen relative overflow-hidden">
      <FallingLeaves count={20} />
      <div className="relative z-10">
        <h1 className="text-6xl font-black">自然にいってみよう</h1>
        <Card className="w-80 p-10">
          <CardDescription className="text-2xl tracking-wide ">
            あなたは自然と触れ合っていますか？<br /> 
            自然と触れ合うことは、自分のストレスレベルを軽減し、<br />
            幸せな気持ちになることができます。<br />
            さあ、探してみよう自分の癒やしの場所を。
          </CardDescription>
        </Card>
      </div>
    </main>
  );
}

export default Home;