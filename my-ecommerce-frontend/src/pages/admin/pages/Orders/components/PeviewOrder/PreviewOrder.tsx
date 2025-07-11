import { ResponsiveForm } from "@/components/ResponsiveForm";
import { Order } from "@/models/order";
import { useState } from "react";
import {
  getItemsQuantity,
  getShippingConfig,
  getStatusConfig,
} from "../../utils/orderHelpers";
import { Box, Calendar, Eye, ShoppingBag, Truck, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface PreviewOrderProps {
  order: Order;
}

export const PreviewOrder = ({ order }: PreviewOrderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const triggerIcon = <Eye className="h-4 w-4" />;

  const {
    label: statusLabel,
    className: statusClassName,
    icon: statusIcon,
  } = getStatusConfig(order.status);
  const {
    label: shippingLabel,
    className: shippingClassName,
    icon: shippingIcon,
  } = getShippingConfig(order.shippingMethod);

  return (
    <ResponsiveForm
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Order Details"
      description={"Order id: " + order._id}
      triggerIcon={triggerIcon}
      classNames="mx-auto py-8 px-4 md:px-6 min-w-[90vw] h-[90vh] overflow-y-auto"
    >
      {/* Header: Status and Date */}
      <section className="flex items-center justify-between mb-6">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClassName}`}
        >
          {statusIcon}
          {statusLabel}
        </span>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">
            {new Date(order.createdAt).toDateString()}
          </span>
        </div>
      </section>
      {/* Responsive Grid for Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Customer Info + Order Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <User />
              <span className="ml-2 font-semibold">Custom Information</span>
            </div>
            <div>
              <p className="text-sm">Name</p>
              <p className="font-semibold">{order.orderedByUser?.name}</p>
            </div>
            <div>
              <p className="text-sm">Email</p>
              <p className="font-semibold">{order.orderedByUser?.email}</p>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Truck />
              <span className="ml-2 font-semibold">Shipping Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(order.deliveryAddress).map((key) => (
                <div key={key}>
                  <p className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="font-semibold">
                    {
                      order.deliveryAddress[
                        key as keyof typeof order.deliveryAddress
                      ]
                    }
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Right Column: Ordered Items + Shipping Info */}
        <div className="space-y-6">
          {/* Ordered Items */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ShoppingBag />
              <span className="ml-2 font-semibold">Ordered Items</span>
            </div>
            {order.orderedItems.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center justify-between space-x-4 p-2 bg-white rounded"
              >
                <div className="flex items-center space-x-2">
                  <img
                    // src={item.productId.imageUrl}
                    alt={item.productId.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.productId.name}</p>
                    <p className="text-xs">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    ${item.productId.price * item.quantity}
                  </p>
                  <p className="text-xs font-bold text-gray-500">
                    ${item.productId.price} each
                  </p>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-m font-semibold">Total:</span>
              <span className="text-xl font-bold">${order.priceToPay}</span>
            </div>
          </section>
          {/* Order summary */}
          <section className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Box />
              <span className="ml-2 font-semibold">Order Summary</span>
            </div>
            <div>
              <p className="text-sm">Items</p>
              <p className="font-semibold">
                {getItemsQuantity(order.orderedItems)}
              </p>
            </div>
            <div>
              <p className="text-sm">Total Amount</p>
              <p className="font-bold text-xl">${order.priceToPay}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm">Shipping Method</p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${shippingClassName}`}
              >
                {shippingIcon}
                {shippingLabel}
              </span>
            </div>
          </section>
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex w-full justify-end flex-col sm:flex-row items-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className={"transition-all duration-200 w-full sm:w-fit"}
        >
          Cancel
        </Button>
      </div>
    </ResponsiveForm>
  );
};
