import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryAddress } from "@/models/user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import PrimaryAddressCard from "../PrimaryAddressCard";
import { CheckoutFormData } from "../../utils/formValidate";

interface CheckoutFormInterface {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: CheckoutFormData;
  usePrimaryAddress: boolean;
  onAddressSelectionChange: (usePrimary: boolean) => void;
  primaryAddress: DeliveryAddress | null;
  errors?: Record<string, string>;
}

const CheckoutForm: React.FC<CheckoutFormInterface> = ({
  onInputChange,
  formData,
  usePrimaryAddress,
  onAddressSelectionChange,
  primaryAddress,
  errors = {},
}) => {
  const {
    email,
    firstName,
    lastName,
    address,
    city,
    state,
    zipcode,
    country,
    postalCode,
    phoneNumber,
  } = formData;

  return (
    <form>
      <div className="space-y-1 flex flex-col mb-4">
        <Label className="text-lg mb-4">Choose Address</Label>
        <RadioGroup
          value={usePrimaryAddress ? "primary" : "new"}
          onValueChange={(value) =>
            onAddressSelectionChange(value === "primary")
          }
          className="flex flex-col"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="primary" id="primary" />
            <Label htmlFor="primary">Use Saved Address</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">Enter New Address</Label>
          </div>
        </RadioGroup>
      </div>
      <Separator className="mb-2" />

      {usePrimaryAddress ? (
        <div className="px-1 pt-2">
          {primaryAddress ? (
            <PrimaryAddressCard primaryAddress={primaryAddress} />
          ) : (
            <p className="text-red-500 text-left">
              No primary address found. Please enter a new address.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 px-1 pt-2">
          {/* Contact Info - Email on its own row */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onInputChange}
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={onInputChange}
                placeholder="Enter your first name"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 text-left">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={onInputChange}
                placeholder="Enter your last name"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 text-left">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={onInputChange}
                placeholder="Enter your address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500 text-left">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={onInputChange}
                placeholder="Enter your city"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500 text-left">{errors.city}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                type="text"
                value={state}
                onChange={onInputChange}
                placeholder="Enter your state"
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-500 text-left">{errors.state}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="zipcode">Zipcode</Label>
              <Input
                id="zipcode"
                name="zipcode"
                type="number"
                value={zipcode || ""}
                onChange={onInputChange}
                placeholder="Enter your zipcode"
                className={errors.zipcode ? "border-red-500" : ""}
              />
              {errors.zipcode && (
                <p className="text-sm text-red-500 text-left">
                  {errors.zipcode}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                type="text"
                value={country}
                onChange={onInputChange}
                placeholder="Enter your country"
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-sm text-red-500 text-left">
                  {errors.country}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="number"
                value={postalCode}
                onChange={onInputChange}
                placeholder="Enter your postal code"
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-500 text-left">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={onInputChange}
              placeholder="Enter your phone number"
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 text-left">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
