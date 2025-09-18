import { Product, ProductsResponse } from "@/models/product";
import SearchResultItem from "./SearchResultItem";
import CategoriesFound from "./CategoriesFound";

interface SearchResultsDropdownProps {
  showDropdown: boolean;
  isSearching: boolean;
  hasResults: boolean;
  searchedItems: ProductsResponse;
  searchQuery: string;
  handleResultClick: () => void;
  formatPrice: (price: number, currency?: string) => string;
  renderRating: (rating: number) => React.ReactNode;
}

const SearchResultsDropdown = ({
  showDropdown,
  isSearching,
  hasResults,
  searchedItems,
  searchQuery,
  handleResultClick,
  formatPrice,
  renderRating,
}: SearchResultsDropdownProps) => {
  if (!showDropdown) return null;
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
      {isSearching ? (
        <div className="p-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Searching products...
          </div>
        </div>
      ) : hasResults ? (
        <>
          {/* Categories found */}
          <CategoriesFound
            categories={searchedItems.categoriesFound || []}
            onClick={handleResultClick}
          />
          <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
            {searchedItems.meta.pagination.totalResults} result
            {searchedItems.meta.pagination.totalResults !== 1 ? "s" : ""} found
          </div>
          <div className="py-1">
            {searchedItems.data.map((item: Product) => (
              <SearchResultItem
                key={item._id}
                item={item}
                onClick={handleResultClick}
                formatPrice={formatPrice}
                renderRating={renderRating}
              />
            ))}
          </div>
        </>
      ) : searchQuery.trim().length > 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">
            No products found for "{searchQuery}"
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your search terms
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchResultsDropdown;
