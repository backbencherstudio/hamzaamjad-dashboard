import { useState, createContext, useContext, ReactNode } from 'react';
import { createPortcustsApi, getAllPortcustsApi, updatePortcustsApi, deletePortcustsApi } from '@/apis/portcustsApis';
import { toast } from 'react-toastify';

interface Podcast {
    id?: string;
    _id?: string;
    title: string;
    hostName: string;
    date: string;
    mp3?: string;
    cover?: string;
    mp3File?: File | string;
    coverFile?: File | string;
    time?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface PodcastsContextType {
    podcasts: Podcast[];
    loading: boolean;
    creating: boolean;
    updatingId: string | null;
    deletingId: string | null;
    createPodcast: (data: FormData) => Promise<void>;
    updatePodcast: (id: string, data: FormData) => Promise<void>;
    deletePodcast: (id: string) => Promise<void>;
    fetchPodcasts: (page?: number, limit?: number, search?: string) => Promise<void>;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

const PodcastsContext = createContext<PodcastsContextType | undefined>(undefined);

export const usePodcasts = () => {
    const context = useContext(PodcastsContext);
    if (!context) {
        throw new Error('usePodcasts must be used within a PodcastsProvider');
    }
    return context;
};

interface PodcastsProviderProps {
    children: ReactNode;
}

export const PodcastsProvider = ({ children }: PodcastsProviderProps) => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentSearch, setCurrentSearch] = useState('');

    const fetchPodcasts = async (page: number = 1, limit: number = 10, search?: string) => {
        setLoading(true);
        try {
            const response = await getAllPortcustsApi(page, limit, search);
            
            // Handle the correct API response structure
            const responseData = response.data;
            const podcastsData = Array.isArray(responseData?.portcusts) ? responseData.portcusts : [];
            const paginationData = responseData?.pagination || {};
            
            setPodcasts(podcastsData);
            setCurrentPage(paginationData.currentPage || page);
            setTotalPages(paginationData.totalPages || 1);
            setTotalItems(paginationData.totalItems || 0);
            setItemsPerPage(paginationData.itemsPerPage || limit);
            if (search !== undefined) {
                setCurrentSearch(search);
            }
            
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch podcasts');
            setPodcasts([]);
        } finally {
            setLoading(false);
        }
    };

    const createPodcast = async (data: FormData) => {
        setCreating(true);
        try {
            await createPortcustsApi(data);
            toast.success('Podcast created successfully');
            await fetchPodcasts(currentPage, itemsPerPage, currentSearch);
        } catch (error: any) {
            toast.error(error.message || 'Failed to create podcast');
        } finally {
            setCreating(false);
        }
    };

    const updatePodcast = async (id: string, data: FormData) => {
        setUpdatingId(id);
        try {
            await updatePortcustsApi(id, data);
            toast.success('Podcast updated successfully');
            await fetchPodcasts(currentPage, itemsPerPage, currentSearch);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update podcast');
        } finally {
            setUpdatingId(null);
        }
    };

    const deletePodcast = async (id: string) => {
        setDeletingId(id);
        try {
            await deletePortcustsApi(id);
            toast.success('Podcast deleted successfully');
            setPodcasts(prev => prev.filter(p => p.id !== id && p._id !== id));
            setTotalItems(prev => prev - 1);
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete podcast');
        } finally {
            setDeletingId(null);
        }
    };


    const value: PodcastsContextType = {
        podcasts,
        loading,
        creating,
        updatingId,
        deletingId,
        createPodcast,
        updatePodcast,
        deletePodcast,
        fetchPodcasts,
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
    };

    return (
        <PodcastsContext.Provider value={value}>
            {children}
        </PodcastsContext.Provider>
    );
}; 