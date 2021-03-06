import { CreateFileObject, FileObject, UpdateFileObject } from './FileObject';
import { SearchOptionForOrder } from './Option';
import { PageWrapper, ResponseManagementOrdersStatisticsDailySales, ResponseOrder } from './index';

export interface ResponseProduct {
  productId: number;
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  soldOut: boolean;
  freebie: string;
  enableOption: boolean;
  options: ResponseOption[];
  images: FileObject[];
}

export interface ResponseOption {
  optionId: number;
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface CreateProduct {
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  freebie: string;
  enableOption: boolean | number;
  options: CreateOption[];
  images: CreateFileObject[];
}

export interface CreateOption {
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface UpdateProduct {
  productName: string;
  normalSalesPrice: number;
  discountSalesPrice: number;
  disabledOptionTotalStock: number;
  disabledOptionStock: number;
  disabledOptionSafeStock: number;
  freebie: string;
  enableOption: boolean | number;
  options: UpdateOption[];
  images: UpdateFileObject[];
  updateDisabledOptionStock: number;
}

export interface UpdateOption {
  optionId: number | null;
  optionName: string;
  salePrice: number;
  stock: number;
  safeStock: number;
  totalStock: number;
}

export interface ResponseOrderItemProduct {
  productId: number;
  productName: string;
}

export interface ResponseOrderItemProductForReview {
  images: FileObject[];
  productId: number;
  productName: string;
}

export interface SearchProductForOrder {
  productId: number;
  option: SearchOptionForOrder;
}

export interface ResponseManagementProductStatistics {
  productId: number;
  name: string;
  productName: string;
  enableOption: boolean;
  totalSalesAmount: number;
  discountSalesPrice: number;
  totalSalesQuantity: number;
  options: ProductOptions[]
}
export interface ProductOptions {
  "optionName": string;
  "totalSalesAmount": number;
  "salesPrice": number;
  "totalSalesQuantity": number;
  "salesRatio": number;
}

export interface ProductTables {
  "name": string;
  "productName": string;
  "optionName": string;
  "salesPrice": string;
  "totalSalesQuantity": number;
  "totalSalesAmount": string;
}


