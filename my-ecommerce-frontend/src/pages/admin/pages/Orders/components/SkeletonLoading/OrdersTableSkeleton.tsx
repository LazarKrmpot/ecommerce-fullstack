import { Skeleton } from "@/components/ui/skeleton";

export const OrdersTableSkeleton = () => {
  return (
    <div className="space-y-2">
      {/* Table header skeleton */}
      <div className="flex items-center justify-between border-b pb-2">
        <Skeleton className="h-4 w-[120px]" /> {/* Order ID */}
        <Skeleton className="h-4 w-[120px]" /> {/* Customer */}
        <Skeleton className="h-4 w-[80px]" /> {/* Date */}
        <Skeleton className="h-4 w-[80px]" /> {/* Status */}
        <Skeleton className="h-4 w-[120px]" /> {/* Shipping Method */}
        <Skeleton className="h-4 w-[60px]" /> {/* Items */}
        <Skeleton className="h-4 w-[80px]" /> {/* Total */}
        <Skeleton className="h-4 w-[100px] ml-auto" /> {/* Actions */}
      </div>
      {/* Table rows skeleton */}
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[80px]" />
          <div className="flex gap-2 ml-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}; 