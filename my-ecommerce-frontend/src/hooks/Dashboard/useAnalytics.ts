import { getAnalytics } from "@/services/overviewService";
import { useState } from "react";
import { toast } from "sonner";

interface UsersAnalyticsProps {
  products: {
    inStockPercentage: number;
    outOfStockPercentage: number;
  };
  orders: {
    pendingPercentage: number;
    acceptedPercentage: number;
    processingPercentage: number;
    shippedPercentage: number;
    rejectedPercentage: number;
    completedPercentage: number;
    cancelledPercentage: number;
  };
  users: {
    usersWithAccount: number;
  };
}

export const UseAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<UsersAnalyticsProps>({
    products: {
      inStockPercentage: 0,
      outOfStockPercentage: 0,
    },
    orders: {
      pendingPercentage: 0,
      acceptedPercentage: 0,
      processingPercentage: 0,
      shippedPercentage: 0,
      rejectedPercentage: 0,
      completedPercentage: 0,
      cancelledPercentage: 0,
    },
    users: {
      usersWithAccount: 0,
    },
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics();
      setAnalyticsData(response);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Error fetching analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Logic to fetch and update analytics data would go here

  return { loading, analyticsData, fetchAnalyticsData };
};
