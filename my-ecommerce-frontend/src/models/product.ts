import { Category } from "./category";
import { Shop } from "./shop";

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalResults: number;
    };
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  categoryId: Category;
  price: number;
  status: string;
  isFeatured: boolean;
  rating: number;
  currency: string;
  stock: number;
  shopId: Shop;
  createdAt: string;
}

export interface ProductStats {
  total: number;
  featured: number;
  inStock: number;
  outOfStock: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  categoryId: string;
}

export interface UpdateProductPayload {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  categoryId?: string;
}
