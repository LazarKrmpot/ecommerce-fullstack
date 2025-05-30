import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeliveryAddress } from "@/models/user";

interface AddressCardProps {
  address: DeliveryAddress;
  onEdit: (address: DeliveryAddress) => void;
  className?: string;
  onSetPrimary: (id: string) => () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  className,
  onSetPrimary,
}) => {
  const {
    isPrimary,
    address: streetAddress,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
  } = address;

  return (
    <Card
      onClick={onSetPrimary(address._id)}
      className={cn(
        "relative transition-all duration-300 hover:shadow-md",
        isPrimary ? "outline-red-600 outline-solid" : "",
        className
      )}
    >
      <CardContent className="">
        <div className="flex flex-col-reverse items-start space-x-2 mb-4">
          <div className="flex items-start space-x-2 text-left">
            <MapPin className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">{streetAddress}</p>
              <p className="text-slate-600">
                {city}, {state} {postalCode}
              </p>
              <p className="text-slate-600">{country}</p>
            </div>
          </div>

          {isPrimary && (
            <div className="pb-2 w-full flex justify-end sm:absolute sm:top-2 sm:right-2">
              <Badge variant="outline" className="animate-fade-in">
                Primary
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">{phoneNumber}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Address
        </button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
