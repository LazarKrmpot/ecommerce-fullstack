import { getOverview } from "@/services/overviewService";
import { useState } from "react";

interface StatsInfo {
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    canceled: number;
    pending: number;
    completed: number;
    productsSold: number;
  };
  users: {
    total: number;
    customers: number;
  };
  revenue: number;
}

interface OverviewData {
  loading: boolean;
  overviewData: StatsInfo;
  fetchOverviewData: () => Promise<void>;
}

export const useOverview = (): OverviewData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [overviewData, setOverviewData] = useState<StatsInfo>({
    products: {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
    },
    orders: {
      total: 0,
      pending: 0,
      canceled: 0,
      completed: 0,
      productsSold: 0,
    },
    users: {
      total: 0,
      customers: 0,
    },
    revenue: 0,
  });

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const response = await getOverview();
      setOverviewData(response);
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, overviewData, fetchOverviewData };
};
