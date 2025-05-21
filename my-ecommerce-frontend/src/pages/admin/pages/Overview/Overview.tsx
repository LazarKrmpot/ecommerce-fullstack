import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  ShoppingCart,
  Activity,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { User } from "@/models/user";
import { ProductsResponse } from "@/models/product";

interface OverviewProps {
  users: User[];
  products: ProductsResponse;
  loading: boolean;
}

export const Overview = ({ users, products, loading }: OverviewProps) => {
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "Active users in the system",
    },
    {
      title: "Total Products",
      value: products.data.length,
      icon: Package,
      description: "Products in inventory",
    },
    {
      title: "Total Orders",
      value: "0",
      icon: ShoppingCart,
      description: "Orders this month",
    },
    {
      title: "System Status",
      value: "Online",
      icon: Activity,
      description: "All systems operational",
    },
  ];

  console.log("Users:", users);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user._id} className="flex items-center space-x-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  <span>API Status</span>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Database</span>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>Storage</span>
                </div>
                <Badge variant="secondary">75% Used</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
