import {
  CreateProductPayload,
  ProductStats,
  UpdateProductPayload,
} from "@/models/product";
import api from "./api";

export const getProducts = async (page = 1, limit = 20, filter?: string) => {
  try {
    const { data } = await api.get("/products", {
      params: { page, limit, ...(filter ? { filter } : {}) },
    });
    return { data: data.data, meta: data.meta };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (productData: CreateProductPayload) => {
  try {
    const { data } = await api.post("/products", productData);

    return data.createdProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  try {
    const { data } = await api.get("/products/search", {
      params: {
        search: query,
      },
    });
    return { data: data.data, meta: data.meta, categoriesFound: data.categoriesFound };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const { data } = await api.get("/products", {
      params: {
        filter: "isFeatured::eq::true",
      },
    });
    return { data: data.data, meta: data.meta };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    const { data } = await api.get(`/products/category/${categoryId}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductPayload
) => {
  try {
    const { data } = await api.put(`/products/${id}`, productData);
    return data.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const getProductStats = async (): Promise<ProductStats> => {
  try {
    const { data } = await api.get("/products/stats");
    return data.data;
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const uploadProducts = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("/products/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Error uploading products:", error);
    throw error;
  }
};
