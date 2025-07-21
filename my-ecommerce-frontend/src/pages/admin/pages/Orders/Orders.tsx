import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/CustomPagination";
import { useOrdersData } from "@/hooks/orders/useOrdersData";
import { Order, UpdateOrderPayload } from "@/models/order";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateOrder } from "@/services/ordersService";
import { generateOrderPDF } from "./utils/generateOrderPDF";
import { Plus } from "lucide-react";
import { OrdersTableSkeleton } from "./components/SkeletonLoading/OrdersTableSkeleton";
import { useOrderStats } from "@/hooks/orders/useOrderStats";
import { StatsBlock } from "./components/StatsBlock/StatsBlock";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "./components/OrdersTable/OrdersTable";

export const Orders = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [currentFilter, setCurrentFilter] = useState<string>("");

  const { orders, fetchOrders, setOrders, loading } = useOrdersData(
    page,
    perPage,
    currentFilter === "" ? "" : `status::eq::${currentFilter}`
  );

  const { stats, statsLoading, fetchStats } = useOrderStats();

  useEffect(() => {
    fetchOrders();
  }, [page, perPage, currentFilter, fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateOrder = useCallback(
    async (updatedOrder: UpdateOrderPayload): Promise<void> => {
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
    },
    [setOrders, orders]
  );

  const formatOrderedUserInfo = useCallback((order: Order) => {
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
  }, []);

  const onGeneratePDF = useCallback((order: Order) => {
    generateOrderPDF(order);
  }, []);

  const memoizedStats = useMemo(() => stats, [stats]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when perPage changes
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row flex-start justify-between items-left">
        <div className="flex flex-col sm:flex-col items-start">
          <CardTitle className="text-2xl">Orders List</CardTitle>
          <CardDescription>
            Here you can find all of your Orders
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="default"
          onClick={() => fetchOrders()}
          className="transition-all !m-0 duration-200 mt-2 w-full sm:w-fit sm:ml-2"
        >
          <Plus /> Add Order
        </Button>
      </CardHeader>
      <CardContent>
        <>
          {statsLoading ? (
            <div className="grid grid-cols-1 grid-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="text-left space-y-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full max-w-sm"
                >
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-16 mr-4" />
                    <Skeleton className="w-6 h-2 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <StatsBlock stats={memoizedStats} className="mb-10" />
          )}
          <FilterBar setFilter={setCurrentFilter} filter={currentFilter} />
          {loading ? (
            <>
              <OrdersTableSkeleton />
            </>
          ) : (
            <>
              <OrdersTable
                orders={orders}
                loading={loading}
                onUpdateOrder={handleUpdateOrder}
                onGeneratePDF={onGeneratePDF}
                formatOrderedUserInfo={formatOrderedUserInfo}
              />
            </>
          )}
          {orders?.meta?.pagination?.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={orders.meta.pagination.totalPages}
              onPageChange={handlePageChange}
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </>
      </CardContent>
    </Card>
  );
};
