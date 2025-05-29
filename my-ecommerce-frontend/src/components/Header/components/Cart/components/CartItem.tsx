import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem as CartItemModel } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemModel;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeItem,
}) => {
  return (
    <div className="flex gap-4">
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
          <p className="mt-1 text-sm text-muted-foreground">${item.price}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
  );
};

export default CartItem;
