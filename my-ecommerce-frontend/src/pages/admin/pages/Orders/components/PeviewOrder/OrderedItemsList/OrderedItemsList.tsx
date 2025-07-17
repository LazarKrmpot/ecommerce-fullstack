import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Box, CheckCircle, Info, ShoppingBag, XCircle } from "lucide-react";
import {
  checkIfItemsInStock,
  checkItemAvailability,
  getItemsQuantity,
  getShippingConfig,
} from "../../../utils/orderHelpers";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/models/order";

interface OrderedItemsListProps {
  order: Order;
}

export const OrderedItemsList = ({ order }: OrderedItemsListProps) => {
  const { allInStock, outOfStock } = checkIfItemsInStock(order.orderedItems);
  const {
    label: shippingLabel,
    className: shippingClassName,
    icon: shippingIcon,
  } = getShippingConfig(order.shippingMethod);
  return (
    <Card className="p-4 gap-4 bg-gray-50">
      <CardHeader className="flex gap-2 items-center p-0 mb-0">
        <ShoppingBag />
        <span className="font-semibold">Ordered Items</span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea
          className={`h-[400px] ${order.orderedItems.length > 5 ? "pr-4" : ""}`}
        >
          <div className="space-y-2">
            {order.orderedItems.map((item) => {
              const {
                status: itemStatus,
                icon: itemStatusIcon,
                className: itemStatusClassName,
              } = checkItemAvailability(item);

              return (
                <div
                  key={item.productId._id}
                  className="flex items-center border-1 shadow-sm justify-between space-x-4 p-2 bg-white rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      // src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.productId.name}</p>
                      <div className="flex h-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <p className="text-xs">Quantity: {item.quantity} </p>
                        <span
                          className={`text-xs flex items-center gap-1 ${itemStatusClassName}`}
                        >
                          {itemStatusIcon}
                          {itemStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full flex-col justify-between text-right">
                    <p className="text-l font-bold">
                      ${item.productId.price * item.quantity}
                    </p>
                    <p className="text-xs font-bold text-gray-500">
                      ${item.productId.price} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator className="my-6" />

        <section className="flex flex-col sm:flex-row gap-9 sm:gap-4">
          {/* Order summary */}
          <div className="gap-4 bg-gray-50 w-[50%]">
            <div className="flex gap-2 items-center p-0 mb-4">
              <Box />
              <span className="font-semibold">Order Summary</span>
            </div>
            <div className="space-y-4 p-0">
              <div>
                <p className="text-sm">Products</p>
                <p className="font-semibold">
                  {order.orderedItems.length} Product
                  {order.orderedItems.length > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-sm">Items</p>
                <p className="font-semibold">
                  {getItemsQuantity(order.orderedItems)}
                </p>
              </div>
              <div>
                <p className="text-sm">Total Amount</p>
                <p className="font-bold text-xl">
                  ${order.priceToPay.toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">Shipping Method</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${shippingClassName}`}
                >
                  {shippingIcon}
                  {shippingLabel}
                </span>
              </div>
            </div>
          </div>
          {/* Ordered items status */}
          <div className="flex flex-col w-[50%]">
            <div className="flex gap-2 p-0 mb-4">
              <Info />
              <span className="font-semibold">Ordered Items Status</span>
            </div>
            <div className="space-y-2">
              {allInStock ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3" />
                    All items are in stock
                  </span>
                </div>
              ) : (
                outOfStock?.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex items-center gap-2"
                  >
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3" />
                      {item.productId.name} is out of stock
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};
