import { Button } from "@/components/ui/button";
import { CartStep } from "../Cart";
import { Undo2, X } from "lucide-react";

interface CartHeaderProps {
  handlePreviousStep: () => void;
  toggleCart: () => void;
  totalItems: number;
  step: CartStep;
}

const CartHeader: React.FC<CartHeaderProps> = ({
  handlePreviousStep,
  toggleCart,
  totalItems,
  step,
}) => {
  return (
    <div className="flex items-center justify-between border-b px-6 h-16">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <span className="text-sm text-muted-foreground">
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </span>
      </div>
      {step === "cart" && (
        <Button variant="ghost" size="icon" onClick={toggleCart}>
          <X className="h-5 w-5" />
        </Button>
      )}
      {step === "address" && (
        <Button variant="ghost" size="icon" onClick={handlePreviousStep}>
          <Undo2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default CartHeader;
