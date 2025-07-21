import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderResponse, UpdateOrderPayload } from "@/models/order";
import {
  checkIfItemsInStock,
  formatTimeSinceUpdate,
  getItemsQuantity,
  getShippingConfig,
  getStatusConfig,
} from "../../utils/orderHelpers";
import { PreviewOrder } from "../PeviewOrder/PreviewOrder";
import { EditOrder } from "../EditOrder/EditOrder";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";

interface OrdersTableProps {
  orders: OrderResponse;
  loading: boolean;
  onUpdateOrder: (updatedOrder: UpdateOrderPayload) => Promise<void>;
  onGeneratePDF: (order: Order) => void;
  formatOrderedUserInfo: (order: Order) => { name: string; email: string };
}

export const OrdersTable = React.memo(
  ({
    orders,
    onUpdateOrder,
    onGeneratePDF,
    formatOrderedUserInfo,
  }: OrdersTableProps) => {
    return (
      <div className="relative">
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
            {orders.data.length > 0 ? (
              orders?.data?.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const shippingConfig = getShippingConfig(order.shippingMethod);
                const orderedByUser = formatOrderedUserInfo(order);
                const { allInStock } = checkIfItemsInStock(order.orderedItems);

                return (
                  <TableRow
                    className={`text-left ${
                      !allInStock ? "bg-red-50 hover:bg-red-100" : ""
                    }`}
                    key={order._id}
                  >
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
                        <EditOrder
                          allInStock={allInStock}
                          order={order}
                          onSave={onUpdateOrder}
                        />
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);
