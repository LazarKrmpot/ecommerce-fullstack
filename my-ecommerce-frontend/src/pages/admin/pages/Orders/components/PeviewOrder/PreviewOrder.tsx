import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { Order } from "@/models/order";
import { useState } from "react";
import {
  getStatusConfig,
  formatTimeSinceUpdate,
} from "../../utils/orderHelpers";
import { Calendar, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generateOrderPDF } from "../../utils/generateOrderPDF";

import { CustomerInformation } from "./CustomerInformation/CustomerInformation";
import { ShippingInformation } from "./ShippingInformation/ShippingInformation";
import { OrderUpdateInformation } from "./OrderUpdateinfo/OrderUpdateInformation";
import { OrderedItemsList } from "./OrderedItemsList/OrderedItemsList";

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

  const orderedByUser = order.orderedByUser
    ? {
        account: true,
        name: order.orderedByUser.name,
        email: order.orderedByUser.email,
      }
    : {
        account: false,
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
      isOpen={isOpen}
      title="Order Details"
      description={"Order id: " + order._id}
      triggerIcon={triggerIcon}
      headerChildren={headerButton}
      classNames="mx-auto py-6 md:px-4 px-6  min-w-[90vw] 2xl:min-w-[70vw] max-h-[90vh] overflow-y-auto"
    >
      {/* Header: Status and Date */}
      <section className="flex flex-col  sm:flex-row space-y-4 sm:space-y-0 items-center justify-between mb-6 md:mb-0">
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
      <div className="grid md:grid-cols-[2fr_3fr] gap-6 md:gap-2 xl:gap-6">
        {/* Left Column: Customer Info + Order Summary */}
        <div className="space-y-6 md:space-y-2 xl:space-y-6">
          {/* Customer Information */}
          <CustomerInformation orderedByUser={orderedByUser} />
          {/* Shipping Information */}
          <ShippingInformation deliveryAddress={order.deliveryAddress} />
          {/* Order Update Information */}
          <OrderUpdateInformation
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />
        </div>
        {/* Right Column: Ordered Items + Shipping Info */}
        <div className="space-y-6 md:space-y-2 xl:space-y-6">
          {/* Ordered Items */}
          <OrderedItemsList order={order} />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          className={"transition-all duration-200 w-full sm:w-fit"}
        >
          Cancel
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
