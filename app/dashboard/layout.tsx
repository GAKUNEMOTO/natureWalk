
'use client';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/utils/utils";
import Header from "../components/header";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/toaster";
import { NatureProvider } from "@/context/NatureContext";


const inter = Inter({ subsets: ["latin"] });

export default function DashboradLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={cn(inter.className, 'min-h-dvh')}>
          <NatureProvider>
                <Header/>   
                {children}
                <Footer/>
            <Toaster/>
          </NatureProvider>
        </div>
  );
}
