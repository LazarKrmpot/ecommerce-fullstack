import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Order } from "@/models/order";
import { Truck } from "lucide-react";

interface ShippingInformationProps {
  deliveryAddress: Order["deliveryAddress"];
}

export const ShippingInformation = ({
  deliveryAddress,
}: ShippingInformationProps) => {
  return (
    <Card className="bg-gray-50 p-4 gap-4 min-w-50">
      <CardHeader className="flex gap-2 items-center p-0 mb-0">
        <Truck />
        <span className="font-semibold">Shipping Information</span>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Object.keys(deliveryAddress).map((key) => (
            <div key={key}>
              <p className="text-sm capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="font-semibold">
                {deliveryAddress[key as keyof typeof deliveryAddress]}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
