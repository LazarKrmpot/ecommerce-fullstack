import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DeliveryAddress } from "@/models/user";
import { ShippingMethod } from "@/hooks/cart/useCartSummary";
import { CartItem as CartItemModel } from "@/store/cartStore";
import CartItem from "../CartItem";
import PrimaryAddressCard from "../CheckoutForm/PrimaryAddressCard";
import { BoxIcon, MapPin, Truck } from "lucide-react";
import { CheckoutFormData } from "../../utils/formValidate";
import OrderAddress from "./components/OrderAddress";

const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "3-5 business days",
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "1-2 business days",
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    description: "Next business day",
  },
] as const;

interface ConfirmOrderProps {
  items: CartItemModel[];
  selectedAddress: DeliveryAddress | CheckoutFormData | null;
  usePrimaryAddress: boolean;
  shippingMethod: ShippingMethod;
  onShippingMethodChange: (method: ShippingMethod) => void;
  subtotal: number;
  total: number;
}

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({
  items,
  selectedAddress,
  usePrimaryAddress,
  shippingMethod,
  onShippingMethodChange,
}) => {
  const renderAddress = () => {
    if (!selectedAddress) {
      return <p className="text-red-500">No address selected</p>;
    }

    if (usePrimaryAddress) {
      return (
        <PrimaryAddressCard icon={false} primaryAddress={selectedAddress} />
      );
    }

    const address = selectedAddress as CheckoutFormData;
    return <OrderAddress orderAddress={address} />;
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card className="p-5">
        <CardContent className="p-0 flex gap-2 ">
          <BoxIcon className="mt-0.5 h-5 w-5 text-slate-500 mb-2" />
          <div className="w-full">
            <h3 className="text-left font-semibold mb-4">Order Items</h3>
            <div className="space-y-4 w-full">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={() => {}}
                  removeItem={() => {}}
                  isReadOnly
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="p-5">
        <CardContent className="flex gap-2 p-0">
          <MapPin className="h-5 w-5 mt-0.5" />
          <div>
            <h3 className="text-left pb-2 font-semibold">Shipping Address</h3>
            {renderAddress()}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Method */}
      <Card className="p-5">
        <CardContent className="flex gap-2 p-0">
          <Truck className="h-5 w-5 mt-0.5" />
          <div className="flex flex-col gap-4 mb-4 w-full">
            <h3 className="text-left font-semibold">Shipping Method</h3>
            <RadioGroup
              value={shippingMethod}
              onValueChange={(value) =>
                onShippingMethodChange(value as ShippingMethod)
              }
              className="space-y-4"
            >
              {SHIPPING_METHODS.map((method) => (
                <div key={method.id} className="flex">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label
                    htmlFor={method.id}
                    className="ml-2 gap-4 flex items-start flex-col w-full"
                  >
                    <span>{method.label}</span>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmOrder;
