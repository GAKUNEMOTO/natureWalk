
'use client';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/utils/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { NatureProvider } from "@/context/NatureContext";


const inter = Inter({ subsets: ["latin"] });

export default function DashboradLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-dvh')}>
        <AuthProvider>
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
            </AuthProvider>
        </body>
    </html>
  );
}
