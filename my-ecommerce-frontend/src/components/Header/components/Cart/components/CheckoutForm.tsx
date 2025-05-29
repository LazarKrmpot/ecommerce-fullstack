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
  const { firstName, lastName, email, address, city, state, zipCode, country } =
    formData;
  return (
    <form className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={city}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={state}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={zipCode}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={country}
            onChange={onInputChange}
            required
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
