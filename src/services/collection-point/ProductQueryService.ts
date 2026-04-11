import axios from '@/lib/axios';

export const getProductsBySmallPoint = async (
  smallPointId: number,
  workDate: string
): Promise<any> => {
  const response = await axios.get(
    `/product-query/smallCollectionPoint/${smallPointId}`,
    { params: { workDate } }
  );
  return response.data;
};