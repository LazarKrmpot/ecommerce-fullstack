import { StatsBlock } from "@/components/StatsBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverview } from "@/hooks/Dashboard/useOverview";
import { Bell, Calendar } from "lucide-react";
import { useEffect, useMemo } from "react";

export const Overview = () => {
  const { loading, overviewData, fetchOverviewData } = useOverview();

  const statsInfo = useMemo(
    () => [
      {
        value: overviewData?.revenue ?? 0,
        label: "Total Revenue",
        color: "bg-green-500",
      },
      {
        value: overviewData?.orders.total ?? 0,
        label: "Product Sales",
        color: "bg-blue-500",
      },
      {
        value: overviewData?.orders.productsSold ?? 0,
        label: "Completed Orders",
        color: "bg-purple-500",
      },
      {
        value: overviewData?.orders.canceled ?? 0,
        label: "Canceled Orders",
        color: "bg-red-500",
      },
    ],
    [overviewData]
  );

  useEffect(() => {
    fetchOverviewData();
  }, []);

  console.log("Overview Data:", statsInfo);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="">
          <div className="flex items-start justify-between">
            <section className="flex flex-col justify-center items-start space-y-2">
              <p className="text-2xl">Welcome Back!</p>
              <p className="text-sm font-semibold text-muted-foreground">
                Manage your e-commerce platform efficiently
              </p>
            </section>
            <section className="flex items-center space-x-4">
              <div className="shadow rounded-2xl w-fit p-2 flex items-center justify-center">
                <Calendar className="mr-2" />
                {`${new Date().getDate()} ${new Date().toLocaleString(
                  undefined,
                  { month: "long" }
                )}`}
              </div>
              <div className="shadow rounded-full w-fit p-2 flex items-center justify-center">
                <Bell />
              </div>
            </section>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {statsInfo.map((_, idx) => (
              <div
                key={idx}
                className="text-left bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full"
                style={{ minWidth: 0 }}
              >
                <Skeleton className="h-8 w-28 mb-2" />
                <Skeleton className="w-6 h-2 mb-2 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <StatsBlock statsInfo={statsInfo} />
        )}
      </CardContent>
    </Card>
  );
};
