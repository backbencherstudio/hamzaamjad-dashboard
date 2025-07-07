import axiosClient from "@/lib/axisoClients";

// create portcusts api
export const createPortcustsApi = async (data: any) => {
    try {
        const response = await axiosClient.post('/portcusts/create', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create portcusts');
    }
}


export const getAllPortcustsApi = async (page: number, limit: number, search?: string) => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await axiosClient.get(`/portcusts/all?page=${page}&limit=${limit}${searchParam}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to get all portcusts');
    }
}

// update portcusts api
export const updatePortcustsApi = async (id: string, data: any) => {
    try {
        const response = await axiosClient.patch(`/portcusts/update/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update portcusts');
    }
}

// delete portcusts api
export const deletePortcustsApi = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/portcusts/delete/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete portcusts');
    }
}
