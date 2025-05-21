import { ProductsResponse } from "@/models/product";
import { User } from "@/models/user";
import { getProducts } from "@/services/productsService";
import { getAllUsers } from "@/services/userService";
import { useEffect, useState } from "react";

export const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, productData] = await Promise.all([
          getAllUsers(),
          getProducts(),
        ]);
        setUsers(userData);
        setProducts(productData);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, products, loading, error };
};
