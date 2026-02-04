export interface AssignProductsRequest {
  workDate: string;
  productIds: string[];
  targetCompanyIds?: string[];
}

export interface AssignedProduct {
  productId: string;
  postId: string;
  productName: string;
  userName: string;
  address: string;
}
