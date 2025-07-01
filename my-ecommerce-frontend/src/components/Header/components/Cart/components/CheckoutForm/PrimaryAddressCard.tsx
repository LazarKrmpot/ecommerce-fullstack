import { Card, CardContent } from "@/components/ui/card";
import { DeliveryAddress } from "@/models/user";
import { MapPin, Phone } from "lucide-react";
import React from "react";
import { CheckoutFormData } from "../../utils/formValidate";

interface PrimaryAddressCardProps {
  primaryAddress: DeliveryAddress | CheckoutFormData;
  outline?: boolean;
  icon?: boolean;
}

const PrimaryAddressCard: React.FC<PrimaryAddressCardProps> = ({
  primaryAddress,
  outline = false,
  icon = true,
}) => {
  const { address, city, state, postalCode, country, phoneNumber } =
    primaryAddress;

  return (
    <Card
      className={`relative gap-0 p-0 ${
        outline
          ? "outline-red-600 outline-solid"
          : "outline-none shadow-none border-none"
      } `}
    >
      <CardContent className="p-0">
        <div className="flex flex-col-reverse items-start space-x-2 mb-4">
          <div className="flex items-start space-x-2 text-left">
            {icon && (
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="space-y-1">
              <p className="font-medium">{address}</p>
              <p className="text-slate-600">
                {city}, {state} {postalCode}
              </p>
              <p className="text-slate-600">{country}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {icon && <Phone className="h-4 w-4 text-slate-500" />}
          <span className="text-slate-600">{phoneNumber}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrimaryAddressCard;
