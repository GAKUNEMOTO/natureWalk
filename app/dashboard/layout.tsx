
'use client';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NatureProvider } from "@/context/NatureContext";
import { ClerkProvider } from "@clerk/nextjs";


const inter = Inter({ subsets: ["latin"] });

export default function DashboradLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-dvh')}>
        <ClerkProvider>
          <NatureProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
              <Suspense>
                <Header/>   
              </Suspense>
              <Suspense>
                {children}
              </Suspense>
              <Suspense>
                <Footer/>
              </Suspense>
              <Suspense>
            <Toaster/>
          </Suspense>
        </ThemeProvider>
          </NatureProvider>
            </ClerkProvider>
        </body>
    </html>
  );
}
