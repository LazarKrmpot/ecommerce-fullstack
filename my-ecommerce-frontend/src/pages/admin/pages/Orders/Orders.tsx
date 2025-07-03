import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShippingMethod } from "@/hooks";
import { useOrdersData } from "@/hooks/orders/useOrdersData";
import { OrderedItem, OrderStatus } from "@/models/order";
import { CheckCircle, Clock, Package, Truck, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const Orders = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

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

  const getShippingConfig = (method: ShippingMethod) => {
    const configs = {
      standard: {
        label: "Standard",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Package className="w-3 h-3" />,
      },
      express: {
        label: "Express",
        className: "bg-orange-100 text-orange-800 border-orange-200",
        icon: <Truck className="w-3 h-3" />,
      },
      overnight: {
        label: "Overnight",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: <Zap className="w-3 h-3" />,
      },
    };
    return configs[method];
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
                <TableHead>Shipping Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const shippingConfig = getShippingConfig(order.shippingMethod);

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
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${shippingConfig.className}`}
                      >
                        {shippingConfig.icon}
                        {shippingConfig.label}
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
        {orders?.meta?.pagination?.totalPages > 1 &&
          orders?.data?.length > 0 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={
                      page === 1
                        ? "text-black pointer-events-none opacity-50"
                        : "text-black"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: orders.meta.pagination.totalPages },
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setPage(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          page === index + 1
                            ? "bg-primary text-white"
                            : "hover:bg-muted text-black"
                        }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, orders.meta.pagination.totalPages)
                      )
                    }
                    className={
                      page === orders.meta.pagination.totalPages
                        ? "text-black pointer-events-none opacity-50"
                        : "text-black"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
      </CardContent>
    </Card>
  );
};
