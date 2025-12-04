import axios from '@/lib/axios';
import {
    AssignCompanyConfigResponse,
    AssignCompanyConfigPostRequest,
    AssignCompanyConfigPostResponse,
    CompanyConfigDetail
} from '@/types';

// Lấy chi tiết cấu hình công ty theo companyId từ API /api/product-query/config/company/{companyId}
export const getCompanyConfigDetail = async (companyId: number): Promise<CompanyConfigDetail> => {
    const response = await axios.get<CompanyConfigDetail>(`/product-query/config/company/${companyId}`);
    return response.data;
};

// Lấy danh sách cấu hình công ty từ API /api/assign/company-config
export const getAssignCompanyConfig =
    async (): Promise<AssignCompanyConfigResponse> => {
        const response = await axios.get<AssignCompanyConfigResponse>(
            '/assign/company-config'
        );
        return response.data;
    };

// Gửi cấu hình công ty (ratioPercent, smallPoints) lên API POST /api/assign/company-config
export const postAssignCompanyConfig = async (
    data: AssignCompanyConfigPostRequest
): Promise<AssignCompanyConfigPostResponse> => {
    const response = await axios.post<AssignCompanyConfigPostResponse>(
        '/assign/company-config',
        data
    );
    return response.data;
};
