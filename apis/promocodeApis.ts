import axiosClient from "@/lib/axisoClients";

// create promocode data type
export interface CreatePromocodeData {
    code?: string;
    discount?: number;
    validFrom?: string;
    validTo?: string;
}


//create promocode apis
export const createPromocodeApi = async (data?: CreatePromocodeData) => {
    try {
        const response = await axiosClient.post('/subscription/create-promocode', data || {});
        return response.data;
    } catch (error) {
        throw error;
    }
}


// get all promocode apis /subscription/get-all-promocode?page=1&limit=10&status=USED&search=2
export const getAllPromocodeApi = async (page: number, limit: number, status: string, search: string) => {
    try {
        const response = await axiosClient.get(`/subscription/get-all-promocode?page=${page}&limit=${limit}&status=${status}&search=${search}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// delete promocode apis
export const deletePromocodeApi = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/subscription/delete-promocode/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}