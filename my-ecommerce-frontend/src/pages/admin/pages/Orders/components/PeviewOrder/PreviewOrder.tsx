import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { Order } from "@/models/order";
import { useState } from "react";
import {
  getItemsQuantity,
  getShippingConfig,
  getStatusConfig,
  formatTimeSinceUpdate,
} from "../../utils/orderHelpers";
import {
  Box,
  Calendar,
  Clock,
  Eye,
  History,
  Info,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { generateOrderPDF } from "../../utils/generateOrderPDF";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const orderedByUser = order.orderedByUser
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

  const onGeneratePDF = () => {
    generateOrderPDF(order);
  };

  const headerButton = (
    <Button
      type="button"
      variant="default"
      onClick={onGeneratePDF}
      className="transition-all !m-0 duration-200 mt-2 w-full sm:w-fit sm:ml-2"
    >
      Download PDF Summary
    </Button>
  );

  return (
    <ResponsiveDialog
      handleOpenDialog={toggleDialog}
      handleClose={handleClose}
      isOpen={isOpen}
      title="Order Details"
      description={"Order id: " + order._id}
      triggerIcon={triggerIcon}
      headerChildren={headerButton}
      classNames="mx-auto py-6 md:px-4 px-6 min-w-[90vw] 2xl:min-w-[70vw] max-h-[90vh] overflow-y-auto"
    >
      {/* Header: Status and Date */}
      <section className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 items-center justify-between mb-6 md:mb-0">
        <div className="flex items-center w-full sm:w-fit justify-between gap-4">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClassName}`}
          >
            {statusIcon}
            {statusLabel}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeSinceUpdate(order.updatedAt)}
          </span>
        </div>
        <div className="w-full sm:w-fit flex border-1 py-1 px-3 rounded items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">
            {new Date(order.createdAt).toDateString()}
          </span>
        </div>
      </section>
      {/* Responsive Grid for Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-2 xl:gap-6">
        {/* Left Column: Customer Info + Order Summary */}
        <div className="space-y-6 md:space-y-2 xl:space-y-6">
          {/* Customer Information */}
          <Card className="bg-gray-50 p-4 gap-4">
            <CardHeader className="flex p-0 items-center mb-0">
              <User />
              <span className="font-semibold">Customer Information</span>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div>
                <p className="text-sm">Name</p>
                <p className="font-semibold">{orderedByUser?.name}</p>
              </div>
              <div>
                <p className="text-sm">Email</p>
                <p className="font-semibold">{orderedByUser?.email}</p>
              </div>
              {!order.orderedByUser && (
                <div className="flex space-x-1">
                  <div className="h4 w-4">
                    <Info className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-gray-500 italic">
                    This customer does not have an account in the system.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="bg-gray-50 p-4 gap-4 min-w-50">
            <CardHeader className="flex gap-2 items-center p-0 mb-0">
              <Truck />
              <span className="font-semibold">Shipping Information</span>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
          {/* Order Update Information */}
          <Card className="p-4 gap-4 bg-gray-50">
            <CardHeader className="flex gap-2 items-center p-0 mb-0">
              <Info />
              <span className="font-semibold">Order Update Information</span>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order Created
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                  <History className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTimeSinceUpdate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column: Ordered Items + Shipping Info */}
        <div className="space-y-6 md:space-y-2 xl:space-y-6">
          {/* Ordered Items */}
          <Card className="p-4 gap-4 bg-gray-50">
            <CardHeader className="flex gap-2 items-center p-0 mb-0">
              <ShoppingBag />
              <span className="font-semibold">Ordered Items</span>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea
                className={`h-[400px] ${
                  order.orderedItems.length > 5 ? "pr-4" : ""
                }`}
              >
                <div className="space-y-2">
                  {order.orderedItems.map((item) => (
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
                </div>
              </ScrollArea>

              <Separator className="my-6" />
              <section className="space-y-1 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Products:</span>
                  <span className="text-md font-bold">
                    {order.orderedItems.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-m font-semibold">Total:</span>
                  <span className="text-xl font-bold">
                    ${order.priceToPay.toFixed(2)}
                  </span>
                </div>
              </section>
            </CardContent>
          </Card>
          {/* Order summary */}
          <Card className="p-4 gap-4 bg-gray-50">
            <CardHeader className="flex gap-2 items-center p-0 mb-0">
              <Box />
              <span className="font-semibold">Order Summary</span>
            </CardHeader>
            <CardContent className="space-y-4 p-0">
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
              <div className="space-y-1">
                <p className="text-sm">Shipping Method</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${shippingClassName}`}
                >
                  {shippingIcon}
                  {shippingLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
