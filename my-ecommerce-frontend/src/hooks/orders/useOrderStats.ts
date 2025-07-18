import { OrderStats } from "@/models/order";
import { getOrderStats } from "@/services/ordersService";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useOrderStats = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    newOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getOrderStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching order stats:", error);
      toast.error("Error fetching order stats");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  return { stats, statsLoading, fetchStats };
};
