import DashboardLayout from '@/components/reusable/Dashboard/MainLayout/DashboardLayout';
import ProtectedRoute from '@/components/reusable/ProtectedRoute';


export default function DriverDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}
