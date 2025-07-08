import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createPromocodeApi, getAllPromocodeApi, CreatePromocodeData, deletePromocodeApi } from '@/apis/promocodeApis';

export interface PromoCode {
    id: string;
    code: string;
    status: 'ACTIVE' | 'USED';
    userId: string | null;
    createdAt: string;
    updatedAt: string;
    user: any | null;
}

interface PromoCodeContextType {
    promoCodes: PromoCode[];
    loading: boolean;
    creating: boolean;
    deletingId: string | null;
    createPromoCode: (page: number, limit: number, status: string, search: string) => Promise<void>;
    fetchPromoCodes: (page: number, limit: number, status: string, search: string) => Promise<void>;
    deletePromoCode: (id: string) => Promise<void>;
    totalPages: number;
    totalItems: number;
}

const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined);

export const usePromoCodeContext = () => {
    const context = useContext(PromoCodeContext);
    if (context === undefined) {
        throw new Error('usePromoCodeContext must be used within a PromoCodeProvider');
    }
    return context;
};

interface PromoCodeProviderProps {
    children: ReactNode;
}

export const PromoCodeProvider: React.FC<PromoCodeProviderProps> = ({ children }) => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const fetchPromoCodes = useCallback(async (page: number, limit: number, status: string, search: string) => {
        setLoading(true);
        try {
            const response = await getAllPromocodeApi(page, limit, status, search);
            if (response.success && response.promoCodes) {
                setPromoCodes(response.promoCodes);
                setTotalPages(response.pagination?.totalPages || 0);
                setTotalItems(response.pagination?.total || 0);
            } else {
                setPromoCodes([]);
                setTotalPages(0);
                setTotalItems(0);
            }
        } catch (error: any) {
            console.error('Error fetching promo codes:', error);
            toast.error(error?.response?.data?.message || 'Failed to fetch promo codes');
            setPromoCodes([]);
            setTotalPages(0);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, []);

    // Accept page, limit, status, search so the UI can pass current filter/pagination
    const createPromoCode = useCallback(async (page: number, limit: number, status: string, search: string) => {
        setCreating(true);
        try {
            await createPromocodeApi({} as CreatePromocodeData);
            toast.success('Promo code created successfully!');
            // Always refetch after creation for real-time sync
            await fetchPromoCodes(page, limit, status, search);
        } catch (error: any) {
            // console.error('Error creating promo code:', error);
            toast.error(error?.response?.data?.message || 'Failed to create promo code');
        } finally {
            setCreating(false);
        }
    }, [fetchPromoCodes]);

    const deletePromoCode = useCallback(async (id: string) => {
        setDeletingId(id);
        try {
            await deletePromocodeApi(id);
            setPromoCodes(prev => prev.filter(code => code.id !== id));
            setTotalItems(prev => prev - 1);
            toast.success('Promo code deleted!');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to delete promo code');
        } finally {
            setDeletingId(null);
        }
    }, []);

    return (
        <PromoCodeContext.Provider value={{
            promoCodes,
            loading,
            creating,
            deletingId,
            createPromoCode,
            fetchPromoCodes,
            deletePromoCode,
            totalPages,
            totalItems
        }}>
            {children}
        </PromoCodeContext.Provider>
    );
}; 