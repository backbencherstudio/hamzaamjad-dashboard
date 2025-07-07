import axiosClient from "@/lib/axisoClients";

// data type
interface CreateEbookData {
    title: string;
    date: string;
    pdf: string;
    cover: string;
}

// create ebook api // title, date, pdf, cover, pass in body 

export const createEbookApi = async (data: CreateEbookData) => {
    try {
        const response = await axiosClient.post('/ebook/create', data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

// get all ebook api
export const getAllEbookApi = async () => {
    try {
        const response = await axiosClient.get('/ebook/all');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}