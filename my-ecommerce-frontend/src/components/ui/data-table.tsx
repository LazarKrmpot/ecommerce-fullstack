import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[]; // The paginated slice from the backend
  pageCount: number; // Total number of pages (from backend)
  onPageChange: (pageIndex: number) => void; // Trigger refetch
  pageIndex: number; // Current page index (from parent)
  pageSize: number; // Items per page (set by backend)
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  onPageChange,
  pageIndex,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      onPageChange(next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination className="mt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={
                !table.getCanPreviousPage()
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {Array.from({ length: pageCount }).map((_, index) => (
            <PaginationItem key={index}>
              <button
                onClick={() => table.setPageIndex(index)}
                className={`px-3 py-1 rounded-md text-sm ${
                  pageIndex === index
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                {index + 1}
              </button>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
