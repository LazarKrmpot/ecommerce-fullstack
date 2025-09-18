import { useState, useCallback, useMemo } from "react";
import { ProductsResponse } from "@/models/product";
import { searchProducts, getProducts } from "@/services/productsService";
import { debounce } from "@/utils/debounce";

export const useProductSearch = (
  setProducts: React.Dispatch<React.SetStateAction<ProductsResponse>>,
  showAllProducts: boolean = true
) => {
  const [isSearching, setIsSearching] = useState(false);
  const page = 1;
  const limit = 20;

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm: string) => {
        if (!searchTerm.trim()) {
          try {
            setIsSearching(true);
            const results = await getProducts(page, limit);
            setProducts(results);
          } catch (error) {
            console.error("Error fetching products:", error);
          } finally {
            setIsSearching(false);
          }
          return;
        }
        try {
          setIsSearching(true);
          const results = await searchProducts(searchTerm);
          setProducts(results);
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsSearching(false);
        }
      }, 500),
    [setProducts]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const searchTerm = e.target.value.trim();

      if (searchTerm === "" && showAllProducts) {
        debouncedSearch("");
        return;
      }

      if (searchTerm.length >= 2) {
        debouncedSearch(searchTerm);
      }
    },
    [debouncedSearch]
  );

  return {
    handleSearch,
    isSearching,
  };
};
