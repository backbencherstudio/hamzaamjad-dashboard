import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createEbookApi, getAllEbookApi, deleteEbookApi, updateEbookApi, Ebook, CreateEbookData, UpdateEbookData } from '@/apis/ebookApis';
import { toast } from 'react-toastify';

interface EbookContextType {
  ebooks: Ebook[];
  loading: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  createEbook: (data: CreateEbookData) => Promise<boolean>;
  updateEbook: (id: string, data: UpdateEbookData) => Promise<boolean>;
  fetchEbooks: (page?: number, limit?: number, search?: string) => Promise<void>;
  deleteEbook: (id: string) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
}

const EbookContext = createContext<EbookContextType | undefined>(undefined);

export function EbookProvider({ children }: { children: React.ReactNode }) {
    const DEFAULT_ITEMS_PER_PAGE = 10;

    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const fetchEbooks = useCallback(async (page?: number, limit?: number, search?: string) => {
        try {
            setLoading(true);
            const response = await getAllEbookApi(page || 1, limit || DEFAULT_ITEMS_PER_PAGE, search);

            if (response.success) {
                setEbooks(response.data.ebooks);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            } else {
                toast.error(response.message || 'Failed to fetch ebooks');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch ebooks');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEbook = useCallback(async (data: CreateEbookData): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await createEbookApi(data);

            if (response.success) {
                toast.success('Ebook created successfully');
                setCurrentPage(1);
                const refreshResponse = await getAllEbookApi(1, itemsPerPage);
                if (refreshResponse.success) {
                    setEbooks(refreshResponse.data.ebooks);
                    setTotalPages(refreshResponse.data.pagination.totalPages);
                    setTotalItems(refreshResponse.data.pagination.totalItems);
                }
                return true;
            } else {
                toast.error(response.message || 'Failed to create ebook');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create ebook');
            return false;
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage]);

    const updateEbook = useCallback(async (id: string, data: UpdateEbookData): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await updateEbookApi(id, data);

            if (response.success) {
                toast.success('Ebook updated successfully');
                const refreshResponse = await getAllEbookApi(currentPage, itemsPerPage);
                if (refreshResponse.success) {
                    setEbooks(refreshResponse.data.ebooks);
                    setTotalPages(refreshResponse.data.pagination.totalPages);
                    setTotalItems(refreshResponse.data.pagination.totalItems);
                }
                return true;
            } else {
                toast.error(response.message || 'Failed to update ebook');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update ebook');
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    const deleteEbook = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await deleteEbookApi(id);

            if (response.success) {
                toast.success('Ebook deleted successfully');
                const refreshResponse = await getAllEbookApi(currentPage, itemsPerPage);
                if (refreshResponse.success) {
                    setEbooks(refreshResponse.data.ebooks);
                    setTotalPages(refreshResponse.data.pagination.totalPages);
                    setTotalItems(refreshResponse.data.pagination.totalItems);
                }
                return true;
            } else {
                toast.error(response.message || 'Failed to delete ebook');
                return false;
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete ebook');
            return false;
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage]);

    const setCurrentPageCallback = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const setItemsPerPageCallback = useCallback((limit: number) => {
        setItemsPerPage(limit);
    }, []);

    useEffect(() => {
        const initialFetch = async () => {
            try {
                setLoading(true);
                const response = await getAllEbookApi(1, DEFAULT_ITEMS_PER_PAGE);
                if (response.success) {
                    setEbooks(response.data.ebooks);
                    setTotalPages(response.data.pagination.totalPages);
                    setTotalItems(response.data.pagination.totalItems);
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch ebooks');
            } finally {
                setLoading(false);
            }
        };
        initialFetch();
    }, []);

    return (
        <EbookContext.Provider value={{
            ebooks,
            loading,
            totalPages,
            totalItems,
            currentPage,
            itemsPerPage,
            createEbook,
            updateEbook,
            fetchEbooks,
            deleteEbook,
            setCurrentPage: setCurrentPageCallback,
            setItemsPerPage: setItemsPerPageCallback,
        }}>
            {children}
        </EbookContext.Provider>
    );
}

export function useEbook() {
    const context = useContext(EbookContext);
    if (context === undefined) {
        throw new Error('useEbook must be used within an EbookProvider');
    }
    return context;
} 