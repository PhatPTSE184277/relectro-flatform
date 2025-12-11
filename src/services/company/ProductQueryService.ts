import axios from '@/lib/axios';

export const getProductsByCompany = async (
  companyId: string,
  workDate: string
): Promise<any> => {
  const response = await axios.get(
    `/product-query/company/${companyId}`,
    { params: { workDate } }
  );
  return response.data;
};
