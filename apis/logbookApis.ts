import axiosClient from "@/lib/axisoClients";

// get logbook api page, limit, serach 
export const getLogbookApi = async (page: number, limit: number, search?: string) => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await axiosClient.get(`/addlog/get-user-log-summary?page=${page}&limit=${limit}${searchParam}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch logbook');
    }
}


// get single logbook api page, limit, serach 
export const getSingleLogbookApi = async (id: string, page: number, limit: number, search?: string) => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const response = await axiosClient.get(`/addlog/get-user-logs/${id}?page=${page}&limit=${limit}${searchParam}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch logbook');
    }
}


// delete signle logbook api
export const deleteLogbookApi = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/addlog/delete-log/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete logbook');
    }
}
