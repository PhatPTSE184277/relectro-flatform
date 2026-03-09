import axios from '@/lib/axios';

export interface WarehouseCapacity {
    id: string;
    name: string;
    maxCapacity: number;
    currentCapacity: number;
    availableCapacity: number;
}

export interface CompanyCapacity {
    companyId: string;
    companyMaxCapacity: number;
    companyCurrentCapacity: number;
    warehouses: WarehouseCapacity[];
}

export const getCapacityByCompany = async (companyId: string): Promise<CompanyCapacity> => {
    const res = await axios.get<CompanyCapacity>(`/Capacity/company/${companyId}`);
    return res.data;
};
