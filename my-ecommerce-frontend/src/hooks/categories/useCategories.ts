import { Category } from "@/models/category";
import { getCategories } from "@/services/categoriesService";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  return { categories, isLoadingCategories, fetchCategories };
};
