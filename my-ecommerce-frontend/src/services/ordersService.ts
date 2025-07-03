import { CreateOrderRequest } from "@/models/order";
import api from "./api";

export const getOrders = async (page = 1, limit = 10) => {
  try {
    const { data } = await api.get("/orders", {
      params: { page, limit },
    });
    return { data: data.data, meta: data.meta, message: data.message };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const createOrder = async (orderData: CreateOrderRequest) => {};
