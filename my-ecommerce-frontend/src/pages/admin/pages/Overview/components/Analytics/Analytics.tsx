"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { FilterIcon } from "lucide-react";
import { Doughnut, Line } from "react-chartjs-2";
import { useState } from "react";
import { StatsInfo } from "@/hooks/Dashboard/useOverview";
import { UsersAnalyticsProps } from "@/hooks/Dashboard/useAnalytics";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

interface AnalyticsProps {
  AnalyticsData: UsersAnalyticsProps;
  OverviewData: StatsInfo;
}

export const Analytics = ({ AnalyticsData, OverviewData }: AnalyticsProps) => {
  const [selectedChart, setSelectedChart] = useState<
    "products" | "orders" | "orderTypes"
  >("products");

  const [LineSelectedChart, setLineSelectedChart] = useState<
    "completed" | "cancelled" | "pending" | "total"
  >("total");

  console.log("StatsInfo Data:", OverviewData);

  const doughnutChartConfigs = {
    products: {
      labels: [
        `${AnalyticsData.products.inStockPercentage.toFixed()}% In Stock`,
        `${AnalyticsData.products.outOfStockPercentage.toFixed()}% Out of Stock`,
      ],
      data: [
        AnalyticsData.products.inStockPercentage,
        AnalyticsData.products.outOfStockPercentage,
      ],
      colors: ["#36b6a0", "#dbe9e9"],
    },
    orders: {
      labels: [
        `${AnalyticsData.orders.pendingPercentage.toFixed()}% Pending`,
        `${AnalyticsData.orders.acceptedPercentage.toFixed()}% Accepted`,
        `${AnalyticsData.orders.processingPercentage.toFixed()}% Processing`,
        `${AnalyticsData.orders.shippedPercentage.toFixed()}% Shipped`,
        `${AnalyticsData.orders.rejectedPercentage.toFixed()}% Rejected`,
        `${AnalyticsData.orders.completedPercentage.toFixed()}% Completed`,
        `${AnalyticsData.orders.cancelledPercentage.toFixed()}% Cancelled`,
      ],
      data: [
        AnalyticsData.orders.pendingPercentage,
        AnalyticsData.orders.acceptedPercentage,
        AnalyticsData.orders.processingPercentage,
        AnalyticsData.orders.shippedPercentage,
        AnalyticsData.orders.rejectedPercentage,
        AnalyticsData.orders.completedPercentage,
        AnalyticsData.orders.cancelledPercentage,
      ],
      colors: [
        "#FACC15", // yellow
        "#4ADE80", // green
        "#60A5FA", // blue
        "#818CF8", // indigo
        "#F87171", // red
        "#34D399", // emerald
        "#A78BFA", // violet
      ],
    },
    orderTypes: {
      labels: [
        `${OverviewData.orders.completed} Completed`,
        `${OverviewData.orders.cancelled} Cancelled`,
        `${OverviewData.orders.pending} Pending`,
      ],
      data: [
        OverviewData.orders.completed,
        OverviewData.orders.cancelled,
        OverviewData.orders.pending,
      ],
      colors: ["#10B981", "#EF4444", "#F59E0B"],
    },
  };

  console.log(OverviewData.weeklyOrders.cancelled, "Weekly Orders Data");

  const LineChartDataConfig = {
    completed: {
      lineLabels: OverviewData.weeklyOrders.completed.map(
        (order) => order.date
      ),
      lineData: OverviewData.weeklyOrders.completed.map(
        (order) => order.completedOrders
      ),
      borderColor: "#10B981",
    },
    cancelled: {
      lineLabels: OverviewData.weeklyOrders.cancelled.map(
        (order) => order.date
      ),
      lineData: OverviewData.weeklyOrders.cancelled.map(
        (order) => order.cancelledOrders
      ),
      borderColor: "#EF4444",
    },
    pending: {
      lineLabels: OverviewData.weeklyOrders.pending.map((order) => order.date),
      lineData: OverviewData.weeklyOrders.pending.map(
        (order) => order.pendingOrders
      ),
      borderColor: "#F59E0B",
    },
    total: {
      lineLabels: OverviewData.weeklyOrders.total.map((order) => order.date),
      lineData: OverviewData.weeklyOrders.total.map(
        (order) => order.totalOrders
      ),
      borderColor: "#3B82F6",
    },
  };

  const { labels, data, colors } = doughnutChartConfigs[selectedChart];
  const { lineLabels, lineData, borderColor } =
    LineChartDataConfig[LineSelectedChart];

  const DoughnutChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderRadius: 15,
        borderWidth: 0,
        spacing: 0,
      },
    ],
  };

  console.log(`${LineSelectedChart} Chart Data:`, {
    labels: lineLabels,
    data: lineData,
    borderColor,
  });

  const LineChartData = {
    labels: lineLabels,
    datasets: [
      {
        data: lineData,
        fill: false,
        borderColor: borderColor,
        tension: 0.1,
        pointBackgroundColor: borderColor, // Add point colors
        pointBorderColor: borderColor,
        pointRadius: 5, // Make points visible
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <section className="w-full flex flex-col xl:flex-row items-center space-y-8 xl:space-x-8 justify-between">
      <Card className="w-full xl:w-auto h-[410px] xl:mb-0 xl:flex-1">
        <CardHeader className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start sm:items-center justify-between">
          <CardTitle className="text-left">Analytics Overview</CardTitle>
          <Select
            onValueChange={(value) =>
              setLineSelectedChart(
                value as "completed" | "cancelled" | "pending" | "total"
              )
            }
            value={LineSelectedChart}
          >
            <SelectTrigger className="font-semibold min-w-[100px]">
              <FilterIcon className=" h-4 w-4" />
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed Orders</SelectItem>
              <SelectItem value="cancelled">Cancelled Orders</SelectItem>
              <SelectItem value="pending">Pending Orders</SelectItem>
              <SelectItem value="total">Total Orders</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <Line
            key={LineSelectedChart}
            data={LineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Change this to false
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true, // Add this to better show small values
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="xl:w-[400px] w-full">
        <CardHeader className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start sm:items-center justify-between">
          <CardTitle className="text-left">Analytics Overview</CardTitle>
          <Select
            onValueChange={(value) =>
              setSelectedChart(value as "products" | "orders" | "orderTypes")
            }
            value={selectedChart}
          >
            <SelectTrigger className="font-semibold min-w-[100px]">
              <FilterIcon className=" h-4 w-4" />
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="products">Product Stock</SelectItem>
              <SelectItem value="orders">Order Status</SelectItem>
              <SelectItem value="orderTypes">Order Outcomes</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-2 w-full">
          <div className="flex xl:max-w-[300px] items-center justify-center bg-accent p-4 rounded-lg sm:row-span-2 h-[300px]">
            <Doughnut
              key={selectedChart}
              data={DoughnutChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "70%",
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                elements: {
                  arc: {
                    borderWidth: 0,
                    spacing: 0,
                  },
                },
              }}
            />
          </div>

          {/* Stat 1 */}
          <div className="flex flex-col items-start bg-accent p-4 rounded-lg w-full h-full">
            <span className="text-lg text-left font-bold">Total Products</span>
            <span className="text-2xl font-bold text-muted-foreground">
              {OverviewData.products.total}
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-start bg-accent p-4 rounded-lg w-full h-full">
            <span className="text-lg font-bold">Total Orders</span>
            <span className="text-2xl font-bold text-muted-foreground">
              {OverviewData.orders.total}
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
