import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FilterIcon } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsProps {
  products: {
    inStockPercentage: number;
    outOfStockPercentage: number;
  };
  totalOrders: number;
  totalProducts: number;
}

export const Analytics = ({
  products,
  totalOrders,
  totalProducts,
}: AnalyticsProps) => {
  const data = {
    labels: [
      `${products.inStockPercentage.toFixed()}% In Stock`,
      `${products.outOfStockPercentage.toFixed()}% Out of Stock`,
    ],
    datasets: [
      {
        data: [products.inStockPercentage, products.outOfStockPercentage],
        backgroundColor: ["#36b6a0", "#dbe9e9"],
        borderRadius: 15,
        borderWidth: 0,
        spacing: 0,
      },
    ],
  };

  return (
    <div>
      <div className="p-0 flex flex-col items-center justify-center">
        <section className="w-full flex flex-col md:flex-row items-center gap-4 justify-between">
          <Card className="mb-4 md:mb-0 flex-1">
            <CardContent className="flex flex-col items-center justify-center">
              <p className="text-center text-lg font-semibold">
                Product Stock Overview
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Visual representation of product stock status
              </p>
            </CardContent>
          </Card>
          <Card className="sm:w-[400px] mt-4 w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-left">Analytics Overview</CardTitle>
              <Select
                defaultValue="7d"
                onValueChange={(v) => {
                  /* handle time range change */
                }}
              >
                <SelectTrigger className="w-32 text-muted-foreground font-bold">
                  <FilterIcon className="w-4 h-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-2 w-full">
              {/* Chart on the left spanning two rows on sm+ screens */}
              <div className="flex sm:max-w-[300px] items-center justify-center bg-accent p-4 rounded-lg sm:row-span-2 h-[300px]">
                <Doughnut
                  data={data}
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
                <span className="text-lg text-left font-bold">
                  Total Products
                </span>
                <span className="text-2xl font-bold text-muted-foreground">
                  {totalProducts}
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-start bg-accent p-4 rounded-lg w-full h-full">
                <span className="text-lg font-bold">Total Orders</span>
                <span className="text-2xl font-bold text-muted-foreground">
                  {totalOrders}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
