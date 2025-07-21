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
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterBarProps {
  setFilter: (filter: string) => void;
}

export const FilterBar = ({ setFilter }: FilterBarProps) => {
  const [status, setStatus] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleApplyFilters = () => {
    const filters = [];
    if (status) {
      filters.push(`status::eq::${status}`);
    }
    if (shippingMethod) {
      filters.push(`shippingMethod::eq::${shippingMethod}`);
    }
    if (dateRange?.from) {
      filters.push(`createdAt::gte::${dateRange.from.toISOString()}`);
    }
    if (dateRange?.to) {
      filters.push(`createdAt::lte::${dateRange.to.toISOString()}`);
    }
    setFilter(filters.join(";"));
  };

  const handleResetFilters = () => {
    setStatus("");
    setShippingMethod("");
    setDateRange(undefined);
    setFilter("");
  };

  // Accordion for small screens, normal layout for md+
  return (
    <div>
      {/* Accordion for small screens */}
      <div className="block md:hidden mb-2">
        <Accordion
          type="single"
          collapsible
          className="border shadow rounded-md"
        >
          <AccordionItem value="filters" className="px-4">
            <AccordionTrigger className="py-3">Filters</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2 w-full">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
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
                <Select
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Shipping Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Shipping Method</SelectLabel>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <DatePicker
                  date={dateRange}
                  onDateChange={setDateRange}
                  placeholder="Select a date range"
                />
                <div className="flex flex-col lg:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleApplyFilters}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="w-full"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Normal layout for md+ */}
      <div className="hidden md:flex flex-col mb-2 md:flex-row justify-between space-y-4 lg:space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
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
          <Select value={shippingMethod} onValueChange={setShippingMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Shipping Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Shipping Method</SelectLabel>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="overnight">Overnight</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Select a date range"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button variant="outline" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
