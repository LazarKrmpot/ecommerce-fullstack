import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrdersData } from "@/hooks/orders/useOrdersData";
import { OrderedItem, OrderStatus } from "@/models/order";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Orders = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { orders, fetchOrders, setOrders, loading } = useOrdersData(
    page,
    limit
  );

  const getItemsQuantity = (orderedItems: OrderedItem[]) => {
    return orderedItems.reduce((total, item) => total + item.quantity, 0);
  };
  const getStatusConfig = (status: OrderStatus = OrderStatus.PENDING) => {
    const configs = {
      [OrderStatus.PENDING]: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
      },
      [OrderStatus.ACCEPTED]: {
        label: "Accepted",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      [OrderStatus.REJECTED]: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
      },
      [OrderStatus.DELIVERED]: {
        label: "Delivered",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      [OrderStatus.CANCELLED]: {
        label: "Cancelled",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <XCircle className="w-3 h-3" />,
      },
    };
    return configs[status];
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading orders...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <TableRow className="text-left" key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      <p className="text-[1.1rem] font-bold">
                        {order.orderedByUser?.name}
                      </p>
                      <p>{order.orderedByUser?.email}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getItemsQuantity(order.orderedItems)} items
                    </TableCell>
                    <TableCell>${order.priceToPay}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
