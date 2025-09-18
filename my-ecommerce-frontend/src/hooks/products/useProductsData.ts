import { ProductsResponse } from "@/models/product";
import { getProducts } from "@/services/productsService";
import { useState } from "react";
import { toast } from "sonner";

export const useProductsData = (
  page: number,
  limit: number,
  filter?: string
) => {
  const [products, setProducts] = useState<ProductsResponse>({
    data: [],
    meta: {
      pagination: {
        currentPage: 0,
        pageSize: 0,
        totalPages: 0,
        totalResults: 0,
      },
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(page, limit, filter);
      setProducts(response);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  return { products, fetchProducts, setProducts, loading };
};
