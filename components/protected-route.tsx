'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || role !== 'admin')) {
            router.push('/login');
        }
    }, [user, role, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user || role !== 'admin') {
        return null;
    }

    return <>{children}</>;
}