import { useProductSearch } from "@/hooks/products/useProductSearch";
import { useState, useRef, useEffect } from "react";
import { ProductsResponse } from "@/models/product";
import { Star } from "lucide-react";

import SearchInput from "./components/SearchInput";
import SearchResultsDropdown from "./components/SearchResultsDropdown";

export const SearchProducts = ({ className }: { className: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchedItems, setSearchedItems] = useState<ProductsResponse>({
    data: [],
    meta: {
      pagination: {
        currentPage: 1,
        pageSize: 0,
        totalPages: 0,
        totalResults: 0,
      },
    },
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const { handleSearch, isSearching } = useProductSearch(
    setSearchedItems,
    false
  );

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.trim().length > 0);
    handleSearch(e);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    setSearchedItems({
      data: [],
      meta: {
        pagination: {
          currentPage: 1,
          pageSize: 0,
          totalPages: 0,
          totalResults: 0,
        },
      },
    });
  };

  // Handle result click
  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
    setSearchedItems({
      data: [],
      meta: {
        pagination: {
          currentPage: 1,
          pageSize: 0,
          totalPages: 0,
          totalResults: 0,
        },
      },
    });
  };

  // Format price with currency
  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  // Render star rating
  const renderRating = (rating: number) => {
    if (!rating || rating === 0) return null;

    return (
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const hasResults = searchedItems.data && searchedItems.data.length > 0;
  const showDropdown =
    showResults && (hasResults || isSearching || searchQuery.trim().length > 0);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <SearchInput
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => searchQuery.trim().length > 0 && setShowResults(true)}
        onClear={clearSearch}
        isSearching={isSearching}
      />
      <SearchResultsDropdown
        showDropdown={showDropdown}
        isSearching={isSearching}
        hasResults={hasResults}
        searchedItems={searchedItems}
        searchQuery={searchQuery}
        handleResultClick={handleResultClick}
        formatPrice={formatPrice}
        renderRating={renderRating}
      />
    </div>
  );
};
