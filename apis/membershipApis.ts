import axiosClient from "@/lib/axisoClients";


// get all membership
export const getAllMembership = async (page: number, limit: number, search: string, status: string) => {
    try {
        const response = await axiosClient.get(`/users/membership?page=${page}&limit=${limit}&search=${search}&status=${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        throw error;
    }
}

// members active  
export const membersActiveAndDeactive = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/users/to-active-user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        throw error;
    }
}

// memeber deactive 
export const membersDeactive = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/users/to-deactive-user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        throw error;
    }
}