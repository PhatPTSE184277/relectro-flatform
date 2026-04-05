import axios from '@/lib/axios';

export const getCollectorsByCompany = async (
    companyId: string,
    page: number = 1,
    limit: number = 10
): Promise<any[]> => {
    const response = await axios.get(`/collectors/company/${companyId}`, {
        params: { page, limit }
    });
    return response.data;
};

export const getCollectorById = async (
    collectorId: string
): Promise<any> => {
    const response = await axios.get(`/collectors/${collectorId}`);
    return response.data;
};

export const importCollectorsExcel = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
        '/collectors/import-excel',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};
