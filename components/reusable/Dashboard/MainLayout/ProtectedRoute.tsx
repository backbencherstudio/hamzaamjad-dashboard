'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                // If authenticated but not admin, redirect to login with error
                router.push('/login?error=access_denied');
            }
        }
    }, [isAuthenticated, isAdmin, isLoading, router]);

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#121A35]">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-white" size={48} />
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 