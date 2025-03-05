'use client';
import { signOut } from "@/actions/auth";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Next.jsのルーターを使用

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut();
            } catch (error) {
                console.error('Signout error:', error);
                router.push('/error');
            }
        };

        handleSignOut();
    }, [router]);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <p>Signing out...</p>
        </div>
    );
}