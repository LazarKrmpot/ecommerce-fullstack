import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InformationBoxProps {
  title: string;
  value?: string;
  icon?: typeof LucideIcon;
  iconSize?: number;
  iconColor?: string;
  className?: string;
  filterProducts?: () => void;
  isActive?: boolean;
}

const InformationBox: React.FC<InformationBoxProps> = ({
  title,
  value,
  icon: Icon,
  iconSize = 20,
  iconColor = "currentColor",
  filterProducts,
  isActive,
}) => {
  return (
    <Card
      onClick={filterProducts}
      className={`flex justify-between py-3 gap-0 transition-shadow duration-300 ease-in-out cursor-pointer ${
        isActive ? "outline-2 outline-red-600 shadow-lg" : " hover:shadow-md "
      }`}
    >
      <CardHeader className="flex flex-row items-top justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div
            className={`text-muted-foreground ${
              isActive ? "text-red-600" : ""
            }`}
          >
            <Icon size={iconSize} color={iconColor} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default InformationBox;
