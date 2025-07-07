import axiosClient from "@/lib/axisoClients";

// add instructor api
export const addInstructorApi = async (data: any) => {
    try {
        const response = await axiosClient.post('/instructor/create', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to add instructor');
    }
}


// get all instructor api page, limit, search
export const getAllInstructorApi = async (page: number, limit: number, search?: string, type?: string) => {
    try {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
        const response = await axiosClient.get(`/instructor/all-instructors?page=${page}&limit=${limit}${searchParam}${typeParam}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to get all instructor');
    }
}


// delete instructor api
export const deleteInstructorApi = async (id: string) => {
    try {
        const response = await axiosClient.delete(`/instructor/delete/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete instructor');
    }
}


// active instructor api
export const activeInstructorApi = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/instructor/to-active/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to active instructor');
    }
}

// deactive instructor api
export const deactiveInstructorApi = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/instructor/to-deactive/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to deactive instructor');
    }
}
