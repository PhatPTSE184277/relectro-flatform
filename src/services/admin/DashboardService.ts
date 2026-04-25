import axios from '@/lib/axios';
import type { Product } from '@/types/Product';

export interface ProductCategory {
  categoryName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
}

export interface DashboardSummaryResponse {
  fromDate: string;
  toDate: string;
  totalUsers: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
  };
  totalCompanies: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
  };
  totalProducts: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
  };
  productCategories: ProductCategory[];
}

export interface BrandCategory {
  brandName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
}

export interface AdminBrandSummaryResponse {
  smallCollectionPointId: string;
  fromDate: string;
  toDate: string;
  totalProducts: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange' | 'Stable';
  };
  brands: BrandCategory[];
}

export interface TopUser {
  userId: string;
  name: string;
  email: string;
  totalProducts: number;
  totalPoints: number;
}

export interface TopUsersResponse {
  smallCollectionPointId: string;
  from: string;
  to: string;
  topUsers: TopUser[];
}

export interface UserProduct {
  productId: string;
  productName: string;
  brandName: string;
  status: string;
  point: number;
  createAt: string;
}

export interface BrandDetailItem {
  userName: string;
  categoryName: string;
  point: number;
  collectedDate: string;
  scpName: string;
}

export interface BrandDetailsResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: BrandDetailItem[];
}

export interface OverdueSummaryItem {
  scpId: string;
  scpName: string;
  totalOverdueCount: number;
}

export interface OverdueDetailItem {
  productId: string;
  brandName: string;
  categoryName: string;
  userName: string;
  phoneNumber?: string | null;
  deadlineDate: string;
  daysDelayed: number;
  status: string;
}

export interface OverdueDetailsResponse {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: OverdueDetailItem[];
}

export interface ForceReceiveOverduePayload {
  productId: string;
  qrCode: string;
  description: string;
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

export const getDashboardSummaryByDay = async (
  date: string
): Promise<DashboardSummaryResponse> => {
  const response = await axios.get<DashboardSummaryResponse>(
    '/dashboard/summary/day',
    {
      params: {
        date,
      },
    }
  );
  return response.data;
};

export const getBrandSummary = async (
  fromDate: string,
  toDate: string
): Promise<AdminBrandSummaryResponse> => {
  const response = await axios.get<AdminBrandSummaryResponse>(
    '/dashboard/system/brands/summary',
    {
      params: {
        from: fromDate,
        to: toDate,
      },
    }
  );
  return response.data;
};

export const getBrandSummaryByDay = async (
  date: string
): Promise<AdminBrandSummaryResponse> => {
  const response = await axios.get<AdminBrandSummaryResponse>(
    '/dashboard/system/brands/by-day',
    {
      params: {
        date,
      },
    }
  );
  return response.data;
};

export const getTopUsers = async (
  fromDate: string,
  toDate: string,
  top: number = 20
): Promise<TopUsersResponse> => {
  const response = await axios.get<TopUser[] | TopUsersResponse>(
    '/dashboard/system/topUser/all',
    {
      params: {
        from: fromDate,
        to: toDate,
        top,
      },
    }
  );

  const data = response.data;
  if (Array.isArray(data)) {
    return {
      smallCollectionPointId: 'ALL',
      from: fromDate,
      to: toDate,
      topUsers: data,
    };
  }
  return data;
};

export const getUserProducts = async (
  userId: string
): Promise<UserProduct[]> => {
  const response = await axios.get<UserProduct[] | { userId?: string; products?: UserProduct[] }>(
    `/dashboard/user/${userId}/topUserdetails`
  );
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  return Array.isArray(data?.products) ? data.products : [];
};

export const getDashboardProductById = async (productId: string): Promise<Product> => {
  const response = await axios.get<Product>(`/products/${productId}`);
  return response.data;
};

export const updateDashboardProductPoints = async (
  productId: string,
  newPointValue: number,
  reasonForUpdate: string
): Promise<any> => {
  const response = await axios.put(`/points-transaction/${productId}`, {
    newPointValue,
    reasonForUpdate,
  });
  return response.data;
};

export const getBrandDetails = async (
  brandName: string,
  fromDate: string,
  toDate: string,
  page: number = 1,
  limit: number = 10,
  scpId?: string
): Promise<BrandDetailsResponse> => {
  const response = await axios.get<BrandDetailsResponse>(
    '/dashboard/admin/brand-details',
    {
      params: {
        brandName,
        from: fromDate,
        to: toDate,
        page,
        limit,
        ...(scpId ? { scpId } : {})
      }
    }
  );
  return response.data;
};

export const exportFullSystemExcel = async (
  fromDate: string,
  toDate: string
): Promise<void> => {
  const response = await axios.get('/Export/full-system', {
    params: {
      from: fromDate,
      to: toDate,
    },
    responseType: 'blob',
  });

  const blob = new Blob([response.data], {
    type:
      response.headers['content-type'] ||
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-system-${fromDate}-to-${toDate}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getOverdueSummaries = async (): Promise<OverdueSummaryItem[]> => {
  const response = await axios.get<OverdueSummaryItem[]>('/dashboard/overdue-summaries');
  return response.data;
};

export const getOverdueDetails = async (
  scpId: string,
  page: number = 1,
  limit: number = 10
): Promise<OverdueDetailsResponse> => {
  const response = await axios.get<OverdueDetailsResponse>(`/dashboard/overdue-details/${scpId}`, {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const forceReceiveOverdueProduct = async (
  payload: ForceReceiveOverduePayload
): Promise<any> => {
  const response = await axios.put('/products/force-receive-overdue', payload);
  return response.data;
};