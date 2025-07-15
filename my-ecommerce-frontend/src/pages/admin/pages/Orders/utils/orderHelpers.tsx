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

const formatTimeSinceUpdate = (
  updatedAt: Date | string,
  format: "short" | "long" = "long"
): string | null => {
  const updatedDate =
    typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 4) return null;

  const prefix = format === "long" ? "Updated " : "";

  if (days >= 1) {
    return `${prefix}${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours >= 1) {
    return `${prefix}${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes >= 1) {
    return `${prefix}${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  return `${prefix}just now`;
};

export {
  getItemsQuantity,
  getStatusConfig,
  getShippingConfig,
  formatTimeSinceUpdate,
};
