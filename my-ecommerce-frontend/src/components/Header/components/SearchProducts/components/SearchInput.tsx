import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onClear: () => void;
  isSearching: boolean;
}

const SearchInput = ({
  value,
  onChange,
  onFocus,
  onClear,
  isSearching,
}: SearchInputProps) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <SearchIcon className="h-4 w-4 text-muted-foreground" />
    </span>
    <Input
      id="search"
      placeholder="Search products..."
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className="w-full pl-10 pr-10"
      disabled={isSearching}
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-100 rounded-r-md transition-colors"
        type="button"
      >
        <X className="h-4 w-4 text-muted-foreground hover:text-gray-700" />
      </button>
    )}
  </div>
);

export default SearchInput;
