'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { dashboardApi, membersActiveAndDeactive, membersDeactive, activeInstructorApi, deactiveInstructorApi } from '@/apis/dashboardApis';
import { toast } from 'react-toastify';

interface Weather {
    location: string;
    status: string;
}

interface User {
    name: string;
    id: string;
}

interface NewMembership {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        premium: boolean;
    };
    startDate: string;
    status: string;
}

interface NewPilotUser {
    id: string;
    name: string;
    email: string;
    license: string;
    status: string;
    Weather: Weather[];
}

interface NewInstructor {
    id: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    users: User[];
}

interface DashboardData {
    totalUsers: number;
    totalInstructors: number;
    totalSubscribers: number;
    newMemberships: NewMembership[];
    newPilotUsers: NewPilotUser[];
    newInstructors: NewInstructor[];
}

interface DashboardContextType {
    dashboardData: DashboardData | null;
    loading: boolean;
    error: string | null;
    activatingMemberId: string | null;
    deactivatingMemberId: string | null;
    activatingInstructorId: string | null;
    deactivatingInstructorId: string | null;
    fetchDashboardData: (limit?: number) => Promise<void>;
    activateMember: (id: string) => Promise<void>;
    deactivateMember: (id: string) => Promise<void>;
    activateInstructor: (id: string) => Promise<void>;
    deactivateInstructor: (id: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardContext must be used within DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activatingMemberId, setActivatingMemberId] = useState<string | null>(null);
    const [deactivatingMemberId, setDeactivatingMemberId] = useState<string | null>(null);
    const [activatingInstructorId, setActivatingInstructorId] = useState<string | null>(null);
    const [deactivatingInstructorId, setDeactivatingInstructorId] = useState<string | null>(null);

    const fetchDashboardData = useCallback(async (limit = 3) => {
        setLoading(true);
        setError(null);
        try {
            const res = await dashboardApi(limit);
            setDashboardData(res.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
            toast.error(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    const activateMember = useCallback(async (id: string) => {
        setActivatingMemberId(id);
        setError(null);
        try {
            await membersActiveAndDeactive(id);
            toast.success('Member activated successfully');
            // Update local state
            setDashboardData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    newMemberships: prev.newMemberships.map(membership =>
                        membership.user.id === id
                            ? { ...membership, user: { ...membership.user, status: 'ACTIVE' } }
                            : membership
                    ),
                    newPilotUsers: prev.newPilotUsers.map(user =>
                        user.id === id
                            ? { ...user, status: 'ACTIVE' }
                            : user
                    )
                };
            });
        } catch (err: any) {
            setError(err.message || 'Failed to activate member');
            toast.error(err.message || 'Failed to activate member');
        } finally {
            setActivatingMemberId(null);
        }
    }, []);

    const deactivateMember = useCallback(async (id: string) => {
        setDeactivatingMemberId(id);
        setError(null);
        try {
            await membersDeactive(id);
            toast.success('Member deactivated successfully');
            // Update local state
            setDashboardData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    newMemberships: prev.newMemberships.map(membership =>
                        membership.user.id === id
                            ? { ...membership, user: { ...membership.user, status: 'DEACTIVE' } }
                            : membership
                    ),
                    newPilotUsers: prev.newPilotUsers.map(user =>
                        user.id === id
                            ? { ...user, status: 'DEACTIVE' }
                            : user
                    )
                };
            });
        } catch (err: any) {
            setError(err.message || 'Failed to deactivate member');
            toast.error(err.message || 'Failed to deactivate member');
        } finally {
            setDeactivatingMemberId(null);
        }
    }, []);

    const activateInstructor = useCallback(async (id: string) => {
        setActivatingInstructorId(id);
        setError(null);
        try {
            await activeInstructorApi(id);
            toast.success('Instructor activated successfully');
            // Update local state
            setDashboardData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    newInstructors: prev.newInstructors.map(instructor =>
                        instructor.id === id
                            ? { ...instructor, status: 'ACTIVE' }
                            : instructor
                    )
                };
            });
        } catch (err: any) {
            setError(err.message || 'Failed to activate instructor');
            toast.error(err.message || 'Failed to activate instructor');
        } finally {
            setActivatingInstructorId(null);
        }
    }, []);

    const deactivateInstructor = useCallback(async (id: string) => {
        setDeactivatingInstructorId(id);
        setError(null);
        try {
            await deactiveInstructorApi(id);
            toast.success('Instructor deactivated successfully');
            // Update local state
            setDashboardData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    newInstructors: prev.newInstructors.map(instructor =>
                        instructor.id === id
                            ? { ...instructor, status: 'DEACTIVE' }
                            : instructor
                    )
                };
            });
        } catch (err: any) {
            setError(err.message || 'Failed to deactivate instructor');
            toast.error(err.message || 'Failed to deactivate instructor');
        } finally {
            setDeactivatingInstructorId(null);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <DashboardContext.Provider
            value={{
                dashboardData,
                loading,
                error,
                activatingMemberId,
                deactivatingMemberId,
                activatingInstructorId,
                deactivatingInstructorId,
                fetchDashboardData,
                activateMember,
                deactivateMember,
                activateInstructor,
                deactivateInstructor,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
