import { OrderResponse } from "@/models/order";
import { getOrders } from "@/services/ordersService";
import { useState } from "react";

export const useOrdersData = (page: number, limit: number) => {
  const [orders, setOrders] = useState<OrderResponse>({
    data: [],
    meta: {
      pagination: {
        currentPage: 0,
        pageSize: 0,
        totalPages: 0,
        totalResults: 0,
      },
    },
    message: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders(page, limit);
      setOrders(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { orders, fetchOrders, setOrders, loading };
};
