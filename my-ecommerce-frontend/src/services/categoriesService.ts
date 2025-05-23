import api from "./api";
import { CategoryRequest } from "@/models/category";

export const getCategories = async () => {
  try {
    const { data } = await api.get("/categories");
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (category: CategoryRequest) => {
  const { name, description } = category;
  try {
    const { data } = await api.post("/categories", {
      name,
      description: description || "",
    });
    return data.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
