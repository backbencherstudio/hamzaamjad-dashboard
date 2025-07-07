import axiosClient from "@/lib/axisoClients";

// data type
interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
        license: string;
        createdAt: string;
        updatedAt: string;
    };
    token: string;
}

// login api use try catch
export const loginApi = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const response = await axiosClient.post('/users/login', data);
        return response.data;
    } catch (error: any) {
        // Handle error response
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Login failed. Please try again.');
        }
    }
}


// me api
export const meApi = async () => {
    try {
        const response = await axiosClient.get('/users/me');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}


// forgot password api
export const forgotPasswordApi = async (data: any) => {
    try {
        const response = await axiosClient.post('/users/forgetPassword', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}
// verify token api
export const verifyTokenApi = async (data: any) => {
    try {
        const response = await axiosClient.post('/users/verify-top', data);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to verify OTP');
        }
    }
}

// change password api
export const changePasswordApi = async (data: any) => {
    try {
        const response = await axiosClient.put('/users/change-password', data);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to change password');
        }
    }
}


// resend token api
export const resendTokenApi = async (data: any) => {
    try {
        const response = await axiosClient.patch('/users/resent-otp', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}


// password update api
export const passwordUpdateApi = async (data: any) => {
    try {
        const response = await axiosClient.patch('/users/update-password', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}