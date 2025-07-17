import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Info, History } from "lucide-react";
import { formatTimeSinceUpdate } from "../../../utils/orderHelpers";

interface OrderUpdateInformationProps {
  createdAt: Date;
  updatedAt: Date;
}

export const OrderUpdateInformation = ({
  createdAt,
  updatedAt,
}: OrderUpdateInformationProps) => {
  return (
    <Card className="p-4 gap-4 bg-gray-50">
      <CardHeader className="flex gap-2 items-center p-0 mb-0">
        <Info />
        <span className="font-semibold">Order Update Information</span>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg mt-0.5">
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Order Created</p>
            <p className="text-sm text-gray-600">
              {new Date(createdAt).toDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Last Updated</p>
            <p className="text-sm text-gray-600">
              {formatTimeSinceUpdate(updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
