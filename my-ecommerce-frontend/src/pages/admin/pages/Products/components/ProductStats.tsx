import { ProductStats as ProductsStatsI } from "@/models/product";
import { ProductFilter } from "@/models/productFilters";
import { Package, Star, AlertCircle, CheckCircle } from "lucide-react";
import InformationBox from "./InformationBox";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductStatsProps {
  stats: ProductsStatsI;
  loading: boolean;
  onFilter: (filter: ProductFilter) => void;
  activeFilter: ProductFilter;
}

export const ProductStats = ({
  stats,
  loading,
  onFilter,
  activeFilter,
}: ProductStatsProps) => {
  const statsInfo = [
    {
      value: stats.total,
      filter: ProductFilter.ALL,
      description: "Total Products",
      icon: Package,
      iconColor: "#4f46e5",
    },
    {
      value: stats.featured,
      filter: ProductFilter.FEATURED,
      description: "Total Featured Products",
      icon: Star,
      iconColor: "#eab308",
    },
    {
      value: stats.outOfStock,
      filter: ProductFilter.OUT_OF_STOCK,
      description: "Total Out of Stock Products",
      icon: AlertCircle,
      iconColor: "#ef4444",
    },
    {
      value: stats.inStock,
      filter: ProductFilter.IN_STOCK,
      description: "Total In Stock Products",
      icon: CheckCircle,
      iconColor: "#22c55e",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsInfo.map((info, key) => (
        <InformationBox
          key={key}
          title={info.description}
          value={info.value.toString()}
          icon={info.icon}
          filterProducts={() => onFilter(info.filter)}
          isActive={activeFilter === info.filter}
        />
      ))}
      {loading && <Skeleton className="h-12 w-full" />}
    </div>
  );
};
