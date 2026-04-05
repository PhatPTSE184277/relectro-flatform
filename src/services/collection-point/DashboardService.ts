import axios from '@/lib/axios';

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