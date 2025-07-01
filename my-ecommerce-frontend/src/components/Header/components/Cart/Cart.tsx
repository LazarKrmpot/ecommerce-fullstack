import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./components/CartItem";

import CartHeader from "./components/CartHeader";
import { DeliveryAddress } from "@/models/user";
import { CheckoutFormData, validateAddressForm } from "./utils/formValidate";
import { useCartSummary, ShippingMethod } from "@/hooks/cart/useCartSummary";
import ConfirmOrder from "./components/ConfirmOrder/ConfirmOrder";
import CheckoutForm from "./components/CheckoutForm/CheckoutForm";
import { useIsMobile } from "@/hooks/use-mobile";

export type CartStep = "cart" | "address" | "confirmation";

export function Cart() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } =
    useCartStore();

  const isMobile = useIsMobile();

  const { subtotal, totalItems, getShippingCost, calculateTotal } =
    useCartSummary();
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>("standard");

  const [selectedAddress, setSelectedAddress] = useState<
    DeliveryAddress | CheckoutFormData | null
  >(null);
  const [usePrimaryAddress, setUsePrimaryAddress] = useState(true);

  const cartSteps: Record<number, CartStep> = {
    0: "cart",
    1: "address",
    2: "confirmation",
  };

  const [stepIndex, setStepIndex] = useState(0);
  const step = cartSteps[stepIndex];

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipcode: 0,
    country: "",
    postalCode: 0,
    phoneNumber: "",
  });

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [isMobile, isOpen]);

  const authStorage = localStorage.getItem("auth-storage");
  const primaryAddress = useMemo(() => {
    return authStorage
      ? JSON.parse(authStorage).state?.user?.deliveryAddresses.find(
          (addr: DeliveryAddress) => addr.isPrimary
        )
      : null;
  }, [authStorage]);

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const validationResult = useMemo(() => {
    if (step !== "address") return { isValid: true, errors: {} };
    const errors = validateAddressForm(formData);
    const filteredErrors = Object.entries(errors).reduce(
      (acc, [key, value]) => {
        if (touchedFields[key]) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      isValid: Object.keys(errors).length === 0,
      errors: filteredErrors,
    };
  }, [formData, step, touchedFields]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleNextStep = () => {
    if (step === "address") {
      if (usePrimaryAddress && primaryAddress) {
        setSelectedAddress(primaryAddress);
      } else if (validationResult.isValid) {
        setSelectedAddress(formData);
      } else {
        return;
      }
    }
    setStepIndex((prev) =>
      Math.min(prev + 1, Object.keys(cartSteps).length - 1)
    );
  };

  const handlePreviousStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const renderStepButton = () => {
    switch (step) {
      case "cart":
        return (
          <Button
            onClick={handleNextStep}
            className="w-full"
            disabled={totalItems === 0}
          >
            Proceed to Address
          </Button>
        );
      case "address":
        return (
          <Button
            onClick={handleNextStep}
            className="w-full"
            disabled={
              usePrimaryAddress ? !primaryAddress : !validationResult.isValid
            }
          >
            Proceed to Confirmation
          </Button>
        );
      case "confirmation":
        return (
          <Button
            className="w-full"
            onClick={() => alert("Checkout not implemented yet")}
          >
            Confirm Order
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={toggleCart}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-primary-foreground text-xs flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed m-0 inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleCart}
      />

      {/* Cart Panel */}
      <div
        className={cn(
          "fixed m-0 top-0 right-0 z-50 h-full w-full sm:w-100 bg-background shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <CartHeader
            handlePreviousStep={handlePreviousStep}
            toggleCart={toggleCart}
            totalItems={totalItems}
            step={step}
          />
          <div className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
                  <div className="space-y-6">
                    {step === "cart" &&
                      items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          updateQuantity={updateQuantity}
                          removeItem={removeItem}
                        />
                      ))}
                  </div>

                  {step === "address" && (
                    <>
                      <CheckoutForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        usePrimaryAddress={usePrimaryAddress}
                        onAddressSelectionChange={setUsePrimaryAddress}
                        primaryAddress={primaryAddress}
                        errors={validationResult.errors}
                      />
                    </>
                  )}

                  {step === "confirmation" && (
                    <ConfirmOrder
                      items={items}
                      selectedAddress={selectedAddress}
                      usePrimaryAddress={usePrimaryAddress}
                      shippingMethod={selectedShippingMethod}
                      onShippingMethodChange={setSelectedShippingMethod}
                      subtotal={subtotal}
                      total={calculateTotal(selectedShippingMethod)}
                    />
                  )}
                </ScrollArea>

                <div className="space-y-4 mt-auto">
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shipping</span>
                      <span className="text-sm">
                        ${getShippingCost(selectedShippingMethod).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        ${calculateTotal(selectedShippingMethod).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {renderStepButton()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
