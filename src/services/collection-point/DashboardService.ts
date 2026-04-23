import axios from '@/lib/axios';
import type { Product } from '@/types/Product';

export interface DailyStat {
  date: string;
  count: number;
  absoluteChange: number | null;
  percentChange: number | null;
}

export interface PackageStatsResponse {
  smallCollectionPointId: string;
  fromDate: string;
  toDate: string;
  totalPackages: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange';
  };
  dailyStats: DailyStat[];
}

export const getPackageStats = async (
  smallCollectionPointId: string,
  fromDate: string,
  toDate: string
): Promise<PackageStatsResponse> => {
  const response = await axios.get<PackageStatsResponse>(
    '/dashboard/packages-stats',
    {
      params: {
        smallCollectionPointId,
        from: fromDate,
        to: toDate,
      },
    }
  );
  return response.data;
};

export interface ProductCategory {
  categoryName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange';
}

export interface BrandCategory {
  brandName: string;
  currentValue: number;
  previousValue: number;
  absoluteChange: number;
  percentChange: number;
  trend: 'Increase' | 'Decrease' | 'NoChange';
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

export interface SCPStatsResponse {
  smallCollectionPointId: string;
  fromDate: string;
  toDate: string;
  totalProducts: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange';
  };
  productCategories: ProductCategory[];
}

export interface SCPBrandStatsResponse {
  smallCollectionPointId: string;
  fromDate: string;
  toDate: string;
  totalProducts: {
    currentValue: number;
    previousValue: number;
    absoluteChange: number;
    percentChange: number;
    trend: 'Increase' | 'Decrease' | 'NoChange';
  };
  brands: BrandCategory[];
}

export const getSCPStats = async (
  smallCollectionPointId: string,
  fromDate: string,
  toDate: string
): Promise<SCPStatsResponse> => {
  const response = await axios.get<SCPStatsResponse>(
    '/dashboard/scp/summary',
    {
      params: {
        smallCollectionPointId,
        from: fromDate,
        to: toDate,
      },
    }
  );
  return response.data;
};

export const getSCPStatsByDay = async (
  smallCollectionPointId: string,
  date: string
): Promise<SCPStatsResponse> => {
  const response = await axios.get<SCPStatsResponse>(
    '/dashboard/scp/summary-by-day',
    {
      params: {
        smallCollectionPointId,
        date,
      },
    }
  );
  return response.data;
};

export const getSCPBrandStats = async (
  smallCollectionPointId: string,
  fromDate: string,
  toDate: string
): Promise<SCPBrandStatsResponse> => {
  const response = await axios.get<SCPBrandStatsResponse>(
    `/dashboard/scp/${smallCollectionPointId}/brands/summary`,
    {
      params: {
        from: fromDate,
        to: toDate,
      },
    }
  );
  return response.data;
};

export const getSCPBrandStatsByDay = async (
  smallCollectionPointId: string,
  date: string
): Promise<SCPBrandStatsResponse> => {
  const response = await axios.get<SCPBrandStatsResponse>(
    `/dashboard/scp/${smallCollectionPointId}/brands/by-day`,
    {
      params: {
        date,
      },
    }
  );
  return response.data;
};

export const getTopUsers = async (
  smallCollectionPointId: string,
  fromDate: string,
  toDate: string,
  top: number = 20
): Promise<TopUsersResponse> => {
  const response = await axios.get<TopUser[] | TopUsersResponse>(
    `/dashboard/scp/${smallCollectionPointId}/topUser`,
    {
      params: {
        from: fromDate,
        to: toDate,
        top,
      },
    }
  );

  // Handle both array response and wrapped response
  const data = response.data;
  if (Array.isArray(data)) {
    return {
      smallCollectionPointId,
      from: fromDate,
      to: toDate,
      topUsers: data,
    };
  }
  return data;
};

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