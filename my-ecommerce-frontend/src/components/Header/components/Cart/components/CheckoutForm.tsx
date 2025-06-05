import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutFormData } from "../Cart";

interface CheckoutFormInterface {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: CheckoutFormData;
}

const CheckoutForm: React.FC<CheckoutFormInterface> = ({
  onInputChange,
  formData,
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
    <form className="px-4">
      <div className="grid gap-4">
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
          />
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
            />
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
            />
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
            />
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
            />
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
            />
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
            />
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
            />
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
            />
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
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
