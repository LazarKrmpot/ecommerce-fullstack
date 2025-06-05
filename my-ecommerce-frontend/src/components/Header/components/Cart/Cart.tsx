import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./components/CartItem";
import CheckoutForm from "./components/CheckoutForm";
import CartHeader from "./components/CartHeader";

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  country: string;
  postalCode: number;
  phoneNumber: string;
}

export type CartStep = "cart" | "address" | "confirmation";

export function Cart() {
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    shipping,
    total,
  } = useCartStore();

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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleCart();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, toggleCart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    setStepIndex((prev) =>
      Math.min(prev + 1, Object.keys(cartSteps).length - 1)
    );
  };

  const handlePreviousStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
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
          "fixed m-0 inset-0  z-50 transition-opacity duration-300",
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
                  {step === "cart" &&
                    items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                      />
                    ))}

                  {step === "address" && (
                    <CheckoutForm
                      formData={formData}
                      onInputChange={handleInputChange}
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
                      <span className="text-sm">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  {step === "cart" ? (
                    <Button
                      onClick={handleNextStep}
                      className="w-full"
                      disabled={totalItems === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => alert("Checkout not implemented yet")}
                    >
                      Complete Purchase
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
