import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  perPageOptions = [5, 10, 20, 50, 100],
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 w-full">
      <div className="flex justify-center md:justify-start">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                className={
                  currentPage === 1
                    ? "text-black pointer-events-none opacity-50"
                    : "text-black"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "hover:bg-muted text-black"
                  }`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(currentPage + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "text-black pointer-events-none opacity-50"
                    : "text-black"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="flex items-center gap-2 justify-center md:justify-end">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          Per page:
        </p>
        <Select
          value={perPage.toString()}
          onValueChange={(v) => onPerPageChange(Number(v))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {perPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomPagination;
