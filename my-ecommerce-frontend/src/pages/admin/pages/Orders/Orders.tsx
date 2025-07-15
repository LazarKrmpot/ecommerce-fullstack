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
import { useOrdersData } from "@/hooks/orders/useOrdersData";
import { Order, UpdateOrderPayload } from "@/models/order";

import { useEffect, useState } from "react";
import { EditOrder } from "./components/EditOrder/EditOrder";
import { toast } from "sonner";
import { updateOrder } from "@/services/ordersService";
import {
  formatTimeSinceUpdate,
  getItemsQuantity,
  getShippingConfig,
  getStatusConfig,
} from "./utils/orderHelpers";
import { PreviewOrder } from "./components/PeviewOrder/PreviewOrder";
import { Button } from "@/components/ui/button";
import { generateOrderPDF } from "./utils/generateOrderPDF";
import { Download } from "lucide-react";
import { OrdersTableSkeleton } from "./components/SkeletonLoading/OrdersTableSkeleton";

export const Orders = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { orders, fetchOrders, setOrders, loading } = useOrdersData(
    page,
    limit
  );

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleUpdateOrder = async (
    updatedOrder: UpdateOrderPayload
  ): Promise<void> => {
    const productId = updatedOrder._id;
    if (!productId) {
      toast.error("Order ID is required for update");
      return;
    }

    try {
      const savedOrder = await updateOrder(productId, updatedOrder);
      console.log("Order saved successfully:", savedOrder?.data._id);
      if (!savedOrder || !savedOrder?.data._id) {
        throw new Error("Failed to save order");
      }

      setOrders((prev) => ({
        ...prev,
        data: prev.data.map((order) =>
          order._id === savedOrder?.data._id ? savedOrder.data : order
        ),
      }));
      console.log("Order updated successfully:", orders);

      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const formatOrderedUserInfo = (order: Order) => {
    return order.orderedByUser
      ? {
          name: order.orderedByUser.name,
          email: order.orderedByUser.email,
        }
      : {
          name:
            order.deliveryAddress.firstName +
            " " +
            order.deliveryAddress.lastName,
          email: order.deliveryAddress.email,
        };
  };

  const onGeneratePDF = (order: Order) => {
    generateOrderPDF(order);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <OrdersTableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
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
                const orderedByUser = formatOrderedUserInfo(order);

                return (
                  <TableRow className="text-left" key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      <p className="text-[1.1rem] font-bold">
                        {orderedByUser.name}
                      </p>
                      <p>{orderedByUser.email}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatTimeSinceUpdate(order.updatedAt, "short")}
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
                      {getItemsQuantity(order.orderedItems)}
                    </TableCell>
                    <TableCell>${order.priceToPay.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="text-right gap-2 flex items-center justify-end">
                        <PreviewOrder order={order} />
                        <EditOrder order={order} onSave={handleUpdateOrder} />
                        <Button
                          type="button"
                          onClick={() => onGeneratePDF(order)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                        >
                          <Download />
                        </Button>
                      </div>
                    </TableCell>
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
