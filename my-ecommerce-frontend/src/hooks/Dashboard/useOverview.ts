import { getOverview } from "@/services/overviewService";
import { useState } from "react";

interface WeeklyPendingOrders {
  pendingOrders: number;
  date: string;
}

interface WeeklyCompletedOrders {
  completedOrders: number;
  date: string;
}

interface WeeklyCancelledOrders {
  cancelledOrders: number;
  date: string;
}

interface WeeklyOrdersTotal {
  totalOrders: number;
  date: string;
}
export interface WeeklySales {
  total: WeeklyOrdersTotal[];
  completed: WeeklyCompletedOrders[];
  pending: WeeklyPendingOrders[];
  cancelled: WeeklyCancelledOrders[];
}

export interface StatsInfo {
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    cancelled: number;
    pending: number;
    completed: number;
    productsSold: number;
  };
  users: {
    total: number;
    customers: number;
  };
  revenue: number;
  weeklyOrders: WeeklySales;
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
      cancelled: 0,
      completed: 0,
      productsSold: 0,
    },
    users: {
      total: 0,
      customers: 0,
    },
    revenue: 0,
    weeklyOrders: {
      total: [],
      completed: [],
      pending: [],
      cancelled: [],
    },
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
