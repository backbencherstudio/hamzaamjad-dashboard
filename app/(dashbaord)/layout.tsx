import DashboardLayout from '@/components/reusable/Dashboard/MainLayout/DashboardLayout';
import ProtectedRoute from '@/components/reusable/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';

export default function DriverDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <DashboardLayout>{children}</DashboardLayout>
            </ProtectedRoute>
        </AuthProvider>
    );
}
