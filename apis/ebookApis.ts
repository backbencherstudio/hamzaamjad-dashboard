import axiosClient from "@/lib/axisoClients";

// data types
export interface CreateEbookData {
    title: string;
    date: string;
    pdf: File;
    cover: File;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Ebook {
    id: string;
    title: string;
    date: string;
    pdf: string;
    cover: string;
}

export interface EbookListResponse {
    ebooks: Ebook[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    searchQuery: string | null;
}

// create ebook api
export const createEbookApi = async (data: CreateEbookData): Promise<ApiResponse<Ebook>> => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('date', data.date);
        formData.append('pdf', data.pdf);
        formData.append('cover', data.cover);

        const response = await axiosClient.post('/ebook/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create ebook');
    }
}

// get all ebook api 
export const getAllEbookApi = async (page: number, limit: number, search?: string): Promise<ApiResponse<EbookListResponse>> => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await axiosClient.get(`/ebook/all-ebook?page=${page}&limit=${limit}${searchParam}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch ebooks');
    }
}

// delete ebook api
export const deleteEbookApi = async (id: string): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await axiosClient.delete(`/ebook/delete/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete ebook');
    }
}
