import { OrderResponse } from "@/models/order";
import { getOrders } from "@/services/ordersService";
import { useCallback, useState } from "react";

export const useOrdersData = (page: number, limit: number, filter: string) => {
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

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders(page, limit, filter);
      setOrders(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filter]);

  return { orders, fetchOrders, setOrders, loading };
};
