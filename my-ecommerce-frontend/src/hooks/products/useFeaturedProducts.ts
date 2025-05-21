import { ProductsResponse } from "@/models/product";
import { getFeaturedProducts } from "@/services/productsService";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export const useFeaturedProducts = () => {
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
  const [error, setError] = useState<string>("");

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFeaturedProducts();
      setProducts(response);
      setError("");
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setError("Failed to fetch featured products");
      toast.error("Failed to fetch featured products");
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchFeaturedProducts };
};
