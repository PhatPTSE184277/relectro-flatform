import axios from '@/lib/axios';

export interface ProductCategory {
  categoryName: string;
  count: number;
}

export interface DashboardSummaryResponse {
  fromDate: string;
  toDate: string;
  totalUsers: number;
  totalCompanies: number;
  totalProducts: number;
  productCategories: ProductCategory[];
}

export const getDashboardSummary = async (
  fromDate: string,
  toDate: string
): Promise<DashboardSummaryResponse> => {
  const response = await axios.get<DashboardSummaryResponse>(
    '/dashboard/summary',
    {
      params: {
        from: fromDate,
        to: toDate,
      },
    }
  );
  return response.data;
};