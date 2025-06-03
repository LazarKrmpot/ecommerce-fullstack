import { useState, useEffect } from "react";
import { InfoIcon } from "lucide-react";
import AddressCard from "./AddressCard";
import { DeliveryAddress, DeliveryAddressPost } from "@/models/user";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddAddressForm } from "./AddAddressForm";
import { EditAddressForm } from "./EditAddressForm";
import DeleteAddress from "./DeleteAddress";

interface AddressListProps {
  addresses: DeliveryAddress[];
  createAddress: (address: DeliveryAddressPost) => Promise<DeliveryAddress>;
  updateAddress: (
    addressId: string,
    address: DeliveryAddressPost
  ) => Promise<DeliveryAddress>;
  deleteAddress: (addressId: string) => Promise<void>;
  setPrimaryAddress: (addressId: string) => Promise<DeliveryAddress>;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
}) => {
  const [displayedAddresses, setDisplayedAddresses] =
    useState<DeliveryAddress[]>(addresses);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDisplayedAddresses(addresses);
  }, [addresses]);

  const handleSetPrimary = (id: string) => async () => {
    try {
      setIsLoading(true);
      const updatedAddress = await setPrimaryAddress(id);
      setDisplayedAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isPrimary: addr._id === updatedAddress._id,
        }))
      );
    } catch (error) {
      console.error("Error updating primary address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (newAddress: DeliveryAddressPost) => {
    try {
      setIsLoading(true);
      const addedAddress = await createAddress(newAddress);
      setDisplayedAddresses((prev) => [...prev, addedAddress]);
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = async (
    addressId: string,
    updatedAddress: DeliveryAddressPost
  ) => {
    try {
      setIsLoading(true);
      const editedAddress = await updateAddress(addressId, updatedAddress);
      setDisplayedAddresses((prev) =>
        prev.map((addr) => (addr._id === addressId ? editedAddress : addr))
      );
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      await deleteAddress(addressId);
      setDisplayedAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressId)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4" role="region" aria-label="Delivery Addresses">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl ml-2 font-semibold text-slate-900">
            Delivery Addresses{" "}
            {displayedAddresses.length > 0 &&
              `(${displayedAddresses.length} / 3)`}
          </h2>
          <div className="hidden sm:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon
                  className="h-5 w-5 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Address information"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  You can add up to 3 delivery addresses. Set one as primary for
                  faster checkout.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <AddAddressForm
          onAddAddress={handleAddAddress}
          disabled={isLoading || displayedAddresses.length >= 3}
        />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Address list"
      >
        {displayedAddresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onSetPrimary={handleSetPrimary}
            className={
              address.isPrimary
                ? "md:col-span-2 lg:col-span-1 lg:row-span-1"
                : ""
            }
            disabled={isLoading}
          >
            <EditAddressForm
              address={address}
              onEditAddress={handleEditAddress}
              disabled={isLoading}
            />
            <DeleteAddress
              id={address._id}
              isPrimary={address.isPrimary}
              onDelete={() => handleDeleteAddress(address._id)}
            />
          </AddressCard>
        ))}

        {displayedAddresses.length === 0 && (
          <div
            className="col-span-full p-8 text-center border rounded-lg bg-slate-50"
            role="status"
            aria-label="No addresses"
          >
            <p className="text-slate-500">No addresses added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
