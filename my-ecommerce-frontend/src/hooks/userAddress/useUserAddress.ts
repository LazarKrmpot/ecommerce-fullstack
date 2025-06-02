import { DeliveryAddressPost } from "@/models/user";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from "@/services/addressService";
import { useState } from "react";
import { toast } from "sonner";

export const useUserAddress = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateAddress = async (newAddress: DeliveryAddressPost) => {
    try {
      setLoading(true);
      const response = await createAddress(newAddress);
      toast.success("Address added successfully");
      return response;
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (
    addressId: string,
    updatedAddress: DeliveryAddressPost
  ) => {
    try {
      setLoading(true);
      const response = await updateAddress(addressId, updatedAddress);
      toast.success("Address updated successfully");
      return response;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await deleteAddress(addressId);
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryAddress = async (addressId: string) => {
    try {
      setLoading(true);
      const response = await setPrimaryAddress(addressId);
      toast.success("Primary address updated successfully");
      return response;
    } catch (error) {
      console.error("Error setting primary address:", error);
      toast.error("Failed to set primary address");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createAddress: handleCreateAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
    setPrimaryAddress: handleSetPrimaryAddress,
  };
};
