import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import ProductInfo from "./ProductInfo";
import { Product } from "@/models/product";

interface SearchResultItemProps {
  item: Product;
  onClick: () => void;
  formatPrice: (price: number, currency?: string) => string;
  renderRating: (rating: number) => React.ReactNode;
}

const SearchResultItem = ({
  item,
  onClick,
  formatPrice,
  renderRating,
}: SearchResultItemProps) => (
  <Link
    key={item._id}
    to={`/product/${item._id}`}
    onClick={onClick}
    className="block px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
  >
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        <Package className="h-4 w-4 text-blue-500" />
      </div>
      <ProductInfo
        item={item}
        formatPrice={formatPrice}
        renderRating={renderRating}
      />
    </div>
  </Link>
);

export default SearchResultItem;
