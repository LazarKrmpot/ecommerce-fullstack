interface ProductInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  formatPrice: (price: number, currency?: string) => string;
  renderRating: (rating: number) => React.ReactNode;
}

const ProductInfo = ({ item, formatPrice, renderRating }: ProductInfoProps) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-start justify-between gap-2">
      <div className="">
        <p className="text-sm text-left font-medium text-gray-900 truncate">
          {item.name}
        </p>
        {item.description && (
          <p className="text-xs text-left text-gray-500 line-clamp-2 mt-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {item.price && (
            <span className="text-sm font-medium text-green-600">
              {formatPrice(item.price, item.currency)}
            </span>
          )}
          {renderRating(item.rating)}
          {item.stock !== undefined && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                item.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
            </span>
          )}
          {item.isFeatured && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          {item.categoryId && typeof item.categoryId === "object" && (
            <span>Category: {item.categoryId.name}</span>
          )}
          {item.shopId && typeof item.shopId === "object" && (
            <span>Shop: {item.shopId.name}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProductInfo;
