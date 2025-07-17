import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Info, User } from "lucide-react";

interface CustomerInformationProps {
  orderedByUser: {
    name: string;
    email: string;
    account: boolean;
  };
}

export const CustomerInformation = ({
  orderedByUser,
}: CustomerInformationProps) => {
  return (
    <Card className="bg-gray-50 p-4 gap-4">
      <CardHeader className="flex p-0 items-center mb-0">
        <User />
        <span className="font-semibold">Customer Information</span>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div>
          <p className="text-sm">Name</p>
          <p className="font-semibold">{orderedByUser?.name}</p>
        </div>
        <div>
          <p className="text-sm">Email</p>
          <p className="font-semibold">{orderedByUser?.email}</p>
        </div>
        {!orderedByUser.account && (
          <div className="flex space-x-1">
            <div className="h4 w-4">
              <Info className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-500 italic">
              This customer does not have an account in the system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
