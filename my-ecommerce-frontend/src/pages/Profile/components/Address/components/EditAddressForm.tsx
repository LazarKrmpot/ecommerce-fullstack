import { DeliveryAddress, DeliveryAddressPost } from "@/models/user";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { Edit } from "lucide-react";

interface EditAddressFormProps {
  address: DeliveryAddress;
  onEditAddress: (
    addressId: string,
    address: DeliveryAddressPost
  ) => Promise<void>;
  disabled?: boolean;
}

export const EditAddressForm = ({
  address,
  onEditAddress,
  disabled,
}: EditAddressFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DeliveryAddressPost>({
    address: address.address,
    city: address.city,
    state: address.state,
    zipcode: address.zipcode,
    country: address.country,
    postalCode: address.postalCode,
    phoneNumber: address.phoneNumber,
    isPrimary: address.isPrimary,
  });

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedAddress = {
        ...formData,
        isPrimary: address.isPrimary,
      };
      await onEditAddress(address._id, updatedAddress);
      toggleDialog();
    } catch (error) {
      console.error("Error editing address:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "zipcode" || name === "postalCode"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const trigger = (
    <button
      className="flex items-center text-sm text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-600"
      disabled={disabled}
    >
      <Edit className="h-4 w-4 mr-1" />
      Edit Address
    </button>
  );

  return (
    <ResponsiveDialog
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Edit Address"
      description="Update your delivery address details."
      customTrigger={trigger}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                id="zipcode"
                name="zipcode"
                type="number"
                value={formData.zipcode || ""}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="number"
                value={formData.postalCode || ""}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full md:w-fit items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
        >
          Save Changes
        </button>
      </form>
    </ResponsiveDialog>
  );
};
