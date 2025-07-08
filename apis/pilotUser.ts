import axiosClient from "@/lib/axisoClients";


export const getPolotUserApi = async (page: number, limit: number, search?: string, status?: string) => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const statusParam = status ? `&status=${encodeURIComponent(status)}` : '';
        const url = `/users/all-pilot-user?page=${page}&limit=${limit}${searchParam}${statusParam}`;
        const response = await axiosClient.get(url);
        return response.data;
    } catch (error: any) {
        console.error('Pilot User API Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch polot user');
    }
}