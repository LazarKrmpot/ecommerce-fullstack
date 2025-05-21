import { ProductStats } from "@/models/product";
import { getProductStats } from "@/services/productsService";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useProductStats = () => {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    featured: 0,
    inStock: 0,
    outOfStock: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const statsData = await getProductStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching product stats:", error);
      toast.error("Error fetching product stats");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  return { stats, statsLoading, fetchStats };
};
