import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NatureProvider } from "@/context/NatureContext";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NatureHub",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-dvh')}>
        <ClerkProvider>
          <NatureProvider>
              {children}
          </NatureProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
