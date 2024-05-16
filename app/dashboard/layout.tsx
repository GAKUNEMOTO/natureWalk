
'use client';
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext";


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
          
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
          <Header/>
          {children}
          <Footer/>
        </ThemeProvider>
            </AuthProvider>
        </body>
    </html>
  );
}
