import { CreateOrderRequest, UpdateOrderPayload } from "@/models/order";
import api from "./api";

export const getOrders = async (page = 1, limit = 10, filter = "") => {
  try {
    const { data } = await api.get("/orders", {
      params: { page, limit, filter },
    });
    return { data: data.data, meta: data.meta, message: data.message };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const createOrder = async (orderData: CreateOrderRequest) => {
  try {
    const { data } = await api.post("/orders", orderData);
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

export const updateOrder = async (
  orderId: string,
  updateData: UpdateOrderPayload
) => {
  try {
    const { data } = await api.put(`/orders/${orderId}`, updateData);
    return data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export const getOrderStats = async () => {
  try {
    const { data } = await api.get("/orders/stats");
    return data;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

export const getThisWeekOrders = async () => {
  try {
    const { data } = await api.get("/orders/this-week");
    return data;
  } catch (error) {
    console.error("Error fetching this week's orders:", error);
    throw error;
  }
};
