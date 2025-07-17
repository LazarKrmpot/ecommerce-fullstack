import { ResponsiveDialog } from "@/components/ResponsiveDialog/ResponsiveDialog";
import { Order, OrderStatus, UpdateOrderPayload } from "@/models/order";
import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { ShippingMethod } from "@/hooks";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";

interface EditOrderProps {
  order: Order;
  onSave: (updatedOrder: UpdateOrderPayload) => Promise<void>;
  allInStock: boolean;
}
interface UpdateOrderForm {
  status: OrderStatus;
  shippingMethod: ShippingMethod;
}

export const EditOrder = ({ order, onSave, allInStock }: EditOrderProps) => {
  const ORDER_STATUS_OPTIONS = [
    { value: OrderStatus.PENDING, label: "Pending", disabled: false },
    { value: OrderStatus.ACCEPTED, label: "Accepted", disabled: !allInStock },
    { value: OrderStatus.REJECTED, label: "Rejected", disabled: false },
    { value: OrderStatus.DELIVERED, label: "Delivered", disabled: !allInStock },
    { value: OrderStatus.CANCELLED, label: "Cancelled", disabled: false },
  ];

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
                  disabled={option.disabled}
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
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className={"transition-all duration-200 w-full sm:w-fit"}
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
      {!allInStock && (
        <section className="mt-4 flex items-start gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <Box className="text-yellow-500 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-yellow-700">
              Some items in this order are out of stock.
            </p>
            <p className="text-xs text-yellow-700">
              Please restock items before accepting or delivering this order.
            </p>
          </div>
        </section>
      )}
    </ResponsiveDialog>
  );
};
