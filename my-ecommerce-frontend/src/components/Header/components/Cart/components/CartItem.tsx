import { Button } from "@/components/ui/button";
import { CartItem as CartItemModel } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemModel;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  isReadOnly?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeItem,
  isReadOnly = false,
}) => {
  return (
    <div className="flex gap-4">
      <div className="h-14 w-14 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md outline-1 outline-offset-1">
        <img
          // src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 w-full flex-col justify-between">
        <div className="flex flex-col h-full items-start justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <div
            className={`text-muted-foreground flex items-center w-full justify-between gap-5`}
          >
            <p className="text-xl">${item.price}</p>
            {isReadOnly ? (
              <div className="flex items-center justify-center gap-1">
                <span className="text-xs mb-0.5">x</span>
                <p className="text-sm">{item.quantity}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-none"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
