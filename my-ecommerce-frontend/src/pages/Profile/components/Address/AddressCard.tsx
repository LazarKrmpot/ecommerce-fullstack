import React, { useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeliveryAddress } from "@/models/user";

interface AddressCardProps {
  address: DeliveryAddress;
  className?: string;
  onSetPrimary: (id: string) => () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  className,
  onSetPrimary,
  disabled,
  children,
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

  const handleCardClick = useCallback(() => {
    if (!disabled && !isPrimary) {
      onSetPrimary(address._id)();
    }
  }, [disabled, isPrimary, address._id, onSetPrimary]);

  return (
    <Card
      className={cn(
        "relative transition-all duration-100 hover:shadow-md gap-0",
        isPrimary ? "outline-red-600 outline-solid" : "",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <CardContent
        onClick={handleCardClick}
        className={cn(!isPrimary && !disabled && "cursor-pointer", "pb-5")}
      >
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
              <Badge variant="outline">Primary</Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">{phoneNumber}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-between">
        {children}
      </CardFooter>
    </Card>
  );
};

export default AddressCard;
