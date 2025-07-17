import { Label } from "@/components/ui/label";
import { Order } from "@/models/order";
import { HistoryIcon } from "lucide-react";
import {
  formatTimeSinceUpdate,
  getStatusConfig,
} from "../../utils/orderHelpers";

interface OrderHistoryProps {
  order: Order;
}

export const OrderHistory = ({ order }: OrderHistoryProps) => {
  return (
    <div className="mt-6 space-y-4">
      <Label htmlFor="status" className="text-sm font-bold">
        <HistoryIcon className="inline" />
        Order History
      </Label>
      <ul className=" border-l-2 border-gray-200 dark:border-gray-700 ml-2">
        {order.orderHistory.map((history, idx) => {
          const { label, className, icon } = getStatusConfig(history.status);

          return (
            <li
              className="mb-8 ml-2 items-center space-x-2 flex group transition-transform duration-200 hover:scale-[1.01]"
              key={idx}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 z-10 ${className}`}
                aria-label={label}
              >
                {icon}
              </span>

              <div className="flex flex-col gap-0.5">
                <span
                  className={`font-semibold text-sm not-first:text-gray-900 dark:text-white`}
                >
                  {label}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeSinceUpdate(history.updatedAt)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
