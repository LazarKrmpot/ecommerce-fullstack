import { ShippingMethod } from "@/hooks";
import { OrderedItem, OrderStatus } from "@/models/order";
import { CheckCircle, Clock, Package, Truck, XCircle, Zap } from "lucide-react";

const getItemsQuantity = (orderedItems: OrderedItem[]) => {
  return `${orderedItems.reduce((total, item) => total + item.quantity, 0)} ${
    orderedItems.length > 1 ? "items" : "item"
  }`;
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

export { getItemsQuantity, getStatusConfig, getShippingConfig };
