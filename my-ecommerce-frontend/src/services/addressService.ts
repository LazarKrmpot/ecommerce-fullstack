import { DeliveryAddress, DeliveryAddressPost } from "@/models/user";
import api from "./api";

const updateLocalStorage = (updatedAddresses: DeliveryAddress[]) => {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    const parsed = JSON.parse(authStorage);
    if (parsed.state && parsed.state.user) {
      parsed.state.user.deliveryAddresses = updatedAddresses;
      localStorage.setItem("auth-storage", JSON.stringify(parsed));
    }
  }
};

export const getAddresses = async (): Promise<DeliveryAddress[]> => {
  try {
    const { data } = await api.get("/addresses");
    updateLocalStorage(data.data);
    return data.data;
  } catch (error) {
    console.error("Get addresses error:", error);
    throw error;
  }
};

export const createAddress = async (
  address: DeliveryAddressPost
): Promise<DeliveryAddress> => {
  try {
    const { data } = await api.post("/addresses", address);
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed.state && parsed.state.user) {
        parsed.state.user.deliveryAddresses.push(data.data);
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
      }
    }
    return data.data;
  } catch (error) {
    console.error("Create address error:", error);
    throw error;
  }
};

export const updateAddress = async (
  addressId: string,
  address: DeliveryAddressPost
): Promise<DeliveryAddress> => {
  try {
    const { data } = await api.put(`/addresses/${addressId}`, address);
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed.state && parsed.state.user) {
        const addresses = parsed.state.user.deliveryAddresses;
        const index = addresses.findIndex((addr: DeliveryAddress) => addr._id === addressId);
        if (index !== -1) {
          addresses[index] = data.data;
          localStorage.setItem("auth-storage", JSON.stringify(parsed));
        }
      }
    }
    return data.data;
  } catch (error) {
    console.error("Update address error:", error);
    throw error;
  }
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  try {
    await api.delete(`/addresses/${addressId}`);
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed.state && parsed.state.user) {
        const addresses = parsed.state.user.deliveryAddresses;
        const filteredAddresses = addresses.filter((addr: DeliveryAddress) => addr._id !== addressId);
        parsed.state.user.deliveryAddresses = filteredAddresses;
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
      }
    }
  } catch (error) {
    console.error("Delete address error:", error);
    throw error;
  }
};

export const setPrimaryAddress = async (
  addressId: string
): Promise<DeliveryAddress> => {
  try {
    const { data } = await api.put(`/addresses/${addressId}/primary`);
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed.state && parsed.state.user) {
        const addresses = parsed.state.user.deliveryAddresses;
        addresses.forEach((addr: DeliveryAddress) => {
          addr.isPrimary = addr._id === addressId;
        });
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
      }
    }
    return data.data;
  } catch (error) {
    console.error("Set primary address error:", error);
    throw error;
  }
};
