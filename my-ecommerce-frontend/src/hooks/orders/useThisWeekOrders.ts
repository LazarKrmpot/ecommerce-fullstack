import { Order } from "@/models/order";
import { getThisWeekOrders } from "@/services/ordersService";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseThisWeekOrdersState {
  data: Order[];
  message: string;
}

export const useThisWeekOrders = () => {
  const [loading, setLoading] = useState(true);
  const [thisWeekOrders, setThisWeekOrders] = useState<UseThisWeekOrdersState>({
    data: [],
    message: "",
  });

  const fetchThisWeekOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getThisWeekOrders();
      setThisWeekOrders(data);
    } catch (error) {
      toast.error("Error fetching this week's orders");
      console.error("Error fetching this week's orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, thisWeekOrders, fetchThisWeekOrders };
};
