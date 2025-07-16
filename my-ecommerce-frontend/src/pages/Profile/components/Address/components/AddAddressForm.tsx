import { DeliveryAddressPost } from "@/models/user";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubmitButton } from "@/components/SubmitButton";
interface AddAddressFormProps {
  onAddAddress: (address: DeliveryAddressPost) => Promise<void>;
  disabled?: boolean;
}

export const AddAddressForm = ({
  onAddAddress,
  disabled,
}: AddAddressFormProps) => {
  const [formData, setFormData] = useState<DeliveryAddressPost>({
    address: "",
    city: "",
    state: "",
    zipcode: 0,
    country: "",
    postalCode: 0,
    phoneNumber: "",
    isPrimary: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const isUnchanged =
    formData.address === "" &&
    formData.city === "" &&
    formData.state === "" &&
    formData.zipcode === 0 &&
    formData.country === "" &&
    formData.postalCode === 0 &&
    formData.phoneNumber === "" &&
    formData.isPrimary === false;

  const clearFormData = () => {
    setFormData({
      address: "",
      city: "",
      state: "",
      zipcode: 0,
      country: "",
      postalCode: 0,
      phoneNumber: "",
      isPrimary: false,
    });
  };

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      clearFormData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Address:", formData);
    try {
      setIsLoading(true);
      await onAddAddress(formData);
      clearFormData();
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsLoading(false);
      toggleDialog();
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

  const trigger = disabled ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="flex items-center text-sm font-medium text-slate-700 opacity-50 cursor-not-allowed"
          disabled={disabled}
        >
          <PlusCircle className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline">Add New Address</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          Delete one of your existing addresses to add a new one.
        </p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <button className="flex items-center text-sm font-medium text-slate-700 hover:text-red-600 transition-colors group">
      <PlusCircle className="h-6 w-6 mr-2 group-hover:text-red-600 transition-colors" />
      <span className="hidden sm:inline">Add New Address</span>
    </button>
  );

  return (
    <ResponsiveDialog
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Add New Address"
      description="Please fill in the details of your new delivery address."
      customTrigger={trigger}
      disabled={disabled}
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

        <SubmitButton
          label="Add Address"
          isLoading={isLoading}
          disabled={isUnchanged}
          customClassName="w-full md:w-fit inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      </form>
    </ResponsiveDialog>
  );
};
