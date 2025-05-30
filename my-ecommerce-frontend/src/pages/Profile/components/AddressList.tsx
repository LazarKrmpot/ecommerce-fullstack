import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import AddressCard from "./AddressCard";
import { DeliveryAddress } from "@/models/user";

interface AddressListProps {
  addresses: DeliveryAddress[];
  onAddAddress: () => void;
  onEditAddress: (address: DeliveryAddress) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onAddAddress,
  onEditAddress,
}) => {
  const [displayedAddresses, setDisplayedAddresses] =
    useState<DeliveryAddress[]>(addresses);

  console.log("Addresses:", displayedAddresses);

  const handleSetPrimary = (id: string) => () => {
    const updatedAddresses = displayedAddresses.map((address) => {
      return {
        ...address,
        isPrimary: address._id === id ? true : false,
      };
    });

    setDisplayedAddresses(updatedAddresses);
    //! CONNECT TO BACKEND TO UPDATE PRIMARY ADDRESS
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl ml-2 font-semibold text-slate-900">
          Delivery Addresses
        </h2>
        <button
          onClick={onAddAddress}
          className="flex items-center text-sm font-medium text-slate-700 hover:text-red-600 transition-colors group"
        >
          <PlusCircle className="h-6 w-6 mr-2 group-hover:text-red-600 transition-colors" />
          <span className="hidden sm:inline">Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAddresses.map((address, index) => (
          <AddressCard
            key={index}
            address={address}
            onEdit={onEditAddress}
            onSetPrimary={handleSetPrimary}
            className={
              address.isPrimary
                ? "md:col-span-2 lg:col-span-1 lg:row-span-1"
                : ""
            }
          />
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full p-8 text-center border rounded-lg bg-slate-50">
            <p className="text-slate-500">No addresses added yet</p>
            <button
              onClick={onAddAddress}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
