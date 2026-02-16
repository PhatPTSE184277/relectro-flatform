import axios from '@/lib/axios';

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string | null;
}

export const getParentCategories = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>('/categories/parents');
  return response.data;
};

export const getSubcategories = async (parentId: string): Promise<Category[]> => {
  const response = await axios.get<Category[]>(`/categories/${parentId}/subcategories`);
  return response.data;
};

export interface RecyclingCompany {
  companyId: string;
  companyName: string;
  totalRegisteredCategories?: number;
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

export const getRecyclingCompanies = async (
  pageNumber = 1,
  pageSize = 10
): Promise<PaginatedResponse<RecyclingCompany>> => {
  const response = await axios.get<PaginatedResponse<RecyclingCompany>>(
    '/CompanyCategories/recycling-companies',
    { params: { pageNumber, pageSize } }
  );
  return response.data;
};

export interface CompanyCategoryDetail {
  categoryId: string;
  name: string;
}

export interface CompanyCategoryResponse {
  companyId: string;
  companyName: string;
  totalCategories: number;
  categoryDetails: CompanyCategoryDetail[];
}

export const getCompanyCategories = async (companyId: string): Promise<CompanyCategoryResponse> => {
  const response = await axios.get<CompanyCategoryResponse>(`/CompanyCategories/${companyId}`);
  return response.data;
};

export interface RegisterCompanyCategoriesPayload {
  companyId: string;
  categoryIds: string[];
}

export const registerCompanyCategories = async (payload: RegisterCompanyCategoriesPayload): Promise<any> => {
  const response = await axios.post('CompanyCategories/register', payload);
  return response.data;
};

export interface UpdateCompanyCategoriesPayload {
  companyId: string;
  categoryIds: string[];
}

export const updateCompanyCategories = async (payload: UpdateCompanyCategoriesPayload): Promise<any> => {
  const response = await axios.put('CompanyCategories/update-categories', payload);
  return response.data;
};

const CategoryService = {
  getParentCategories,
  getSubcategories,
  getRecyclingCompanies,
  getCompanyCategories,
  registerCompanyCategories,
  updateCompanyCategories,
};

export default CategoryService;
