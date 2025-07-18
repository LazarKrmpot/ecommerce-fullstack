import { ShippingMethod } from "@/hooks";
import { OrderDeliveryAddress } from "./user";

export interface OrderedItem {
  productId: {
    categoryId: {
      _id: string;
      name: string;
      description: string;
    };
    name: string;
    description: string;
    stock: number;
    price: number;
    rating: number;
    _id: string;
  };
  quantity: number;
}

export interface OrderHistory {
  status: OrderStatus;
  updatedAt: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  orderedByUser: {
    name: string;
    email: string;
    role: "user" | "admin";
    _id: string;
  };
  orderedItems: OrderedItem[];
  deliveryAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    country: string;
    postalCode: number;
    phoneNumber: string;
  };
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  orderHistory: OrderHistory[];
  priceToPay: number;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  data: Order[];
  meta: {
    pagination: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalResults: number;
    };
  };
  message: string;
}

export interface CreateOrderRequest {
  orderedItems: CreateOrderItem[];
  deliveryAddress?: OrderDeliveryAddress;
  usePrimaryAddress: boolean;
  shippingMethod: ShippingMethod;
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  REJECTED = "rejected",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface OrderStats {
  totalOrders: number;
  newOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface UpdateOrderPayload {
  _id: string;
  status?: OrderStatus;
  shippingMethod?: ShippingMethod;
}
