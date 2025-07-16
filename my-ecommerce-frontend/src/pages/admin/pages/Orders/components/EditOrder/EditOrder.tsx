import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { Order, OrderStatus, UpdateOrderPayload } from "@/models/order";
import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { ShippingMethod } from "@/hooks";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Box } from "lucide-react";

interface UpdateOrderForm {
  status: OrderStatus;
  shippingMethod: ShippingMethod;
}

const ORDER_STATUS_OPTIONS = [
  { value: OrderStatus.PENDING, label: "Pending" },
  { value: OrderStatus.ACCEPTED, label: "Accepted" },
  { value: OrderStatus.REJECTED, label: "Rejected" },
  { value: OrderStatus.DELIVERED, label: "Delivered" },
  { value: OrderStatus.CANCELLED, label: "Cancelled" },
];

interface EditOrderProps {
  order: Order;
  onSave: (updatedOrder: UpdateOrderPayload) => Promise<void>;
}

export const EditOrder = ({ order, onSave }: EditOrderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const initialValues: UpdateOrderForm = {
    status: order.status,
    shippingMethod: order.shippingMethod,
  };
  const [formData, setFormData] = useState<UpdateOrderForm>(initialValues);

  const hasChanges = () => {
    return Object.keys(initialValues).some(
      (key) =>
        formData[key as keyof UpdateOrderForm] !==
        initialValues[key as keyof UpdateOrderForm]
    );
  };

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedOrder: UpdateOrderPayload = {
        _id: order._id,
        status: formData.status,
        shippingMethod: formData.shippingMethod,
      };

      await onSave(updatedOrder);
    } catch (error) {
      toast.error("Error updating order");
      console.error("Error updating order:", error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData(initialValues);
  };

  return (
    <ResponsiveDialog
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Update Order"
      description={"Order id: " + order._id}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-bold">
              <Box className="inline" />
              Current Status
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ORDER_STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    formData.status === option.value ? "default" : "outline"
                  }
                  className="w-full"
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      status: option.value as OrderStatus,
                    }));
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="shippingMethod" className="text-sm font-bold">
              <Truck className="inline" />
              Shipping Method
            </Label>
            <div className="flex flex-col gap-3">
              {SHIPPING_METHODS.map((method) => (
                <label key={method.value} className="relative">
                  <input
                    type="radio"
                    name="shipping"
                    value={method.value}
                    checked={formData.shippingMethod === method.value}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        shippingMethod: method.value as ShippingMethod,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      formData.shippingMethod === method.value
                        ? "bg-black "
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex justify-between items-start font-medium text-gray-900 ${
                        formData.shippingMethod === method.value &&
                        "text-white border-black"
                      }`}
                    >
                      <p>{method.label}</p>
                      <p className="text-sm text-gray-500">
                        ${method.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div> */}
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className={cn(
              "transition-all duration-200",
              isLoading && "opacity-50"
            )}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <SubmitButton
            label="Save Changes"
            isLoading={isLoading}
            disabled={!hasChanges() || isLoading}
          />
        </div>
      </form>
    </ResponsiveDialog>
  );
};
