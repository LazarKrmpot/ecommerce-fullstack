import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/models/order";
import React from "react";
import {
  checkIfItemsInStock,
  formatTimeSinceUpdate,
  getItemsQuantity,
  getShippingConfig,
  getStatusConfig,
} from "../../../Orders/utils/orderHelpers";
import { PreviewOrder } from "../../../Orders/components/PeviewOrder/PreviewOrder";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  onGeneratePDF: (order: Order) => void;
  formatOrderedUserInfo: (order: Order) => { name: string; email: string };
}

export const ThisWeekOrdersTable = React.memo(
  ({ orders, onGeneratePDF, formatOrderedUserInfo }: OrdersTableProps) => {
    return (
      <div className="relative">
        <section className="flex items-center justify-between mb-2">
          <p className="text-lg font-bold">This Week's Orders</p>
        </section>
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
            {orders.length > 0 ? (
              orders.map((order) => {
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
                  No orders found for this week.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
);
