import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterOptions } from "../../utils/orderHelpers";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  setFilter: (filter: string) => void;
  filter: string;
}

export const FilterBar = ({ setFilter, filter }: FilterBarProps) => {
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };
  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-lg font-semibold text-gray-800">Order Filters</h2>
      <div className="flex space-x-4">
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order Status</SelectLabel>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setFilter("")} className="">
          Reset
        </Button>
      </div>
    </div>
  );
};
