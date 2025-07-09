'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import { loginApi, meApi } from '@/apis/authApis';

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    license: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async (userToken: string) => {
        try {
            const response = await meApi();
            if (response.success) {
                setUser(response.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            return false;
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setToken(storedToken);

            fetchUserData(storedToken).then((success) => {
                if (!success) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const response = await loginApi({ email, password });

            if (response.user.role !== 'ADMIN') {
                throw new Error('Access denied. Admin privileges required.');
            }

            localStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);

            return {
                success: true,
                message: response.message
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            await fetchUserData(storedToken);
        }
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            logout,
            refreshUser,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 