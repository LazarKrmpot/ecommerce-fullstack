import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

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

  // Add a debug log to check the values
  console.log("Cart State:", { items, totalItems });

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
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 h-[calc(100vh-280px)]">
                  <div className="space-y-4 pr-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            // src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-col items-start justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <Button className="w-full">Checkout</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
