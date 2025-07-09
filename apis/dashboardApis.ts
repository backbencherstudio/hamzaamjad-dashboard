
import axiosClient from "@/lib/axisoClients";


// dashboard api
export const dashboardApi = async (limit: number) => {
    try {
        const response = await axiosClient.get(`/users/dashboard?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        throw error;
    }
}


// members + Pilot User active  
export const membersActiveAndDeactive = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/users/to-active-user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        throw error;
    }
}


// memeber + Pilot User deactive 
export const membersDeactive = async (id: string) => {
    try {
        const response = await axiosClient.patch(`/users/to-deactive-user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memberships:', error);
        throw error;
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
