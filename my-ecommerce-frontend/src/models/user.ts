export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  deliveryAddresses?: DeliveryAddress[];
}

export type DeliveryAddressPost = Omit<DeliveryAddress, "_id">;

export interface DeliveryAddress {
  _id: string;
  isPrimary: boolean;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  country: string;
  postalCode: number;
  phoneNumber: string;
}

export interface UserResponse {
  data: User[];
  meta: {
    page: 0;
    limit: 0;
    total: 0;
  };
}

export interface UpdateUserPayload {
  _id: string;
  name?: string;
  email?: string;
}
