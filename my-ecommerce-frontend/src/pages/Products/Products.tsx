import ProductCard from "@/components/ProductCard";
import { useProductsData } from "@/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React, { useEffect, useState } from "react";

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { products, fetchProducts, loading } = useProductsData(page, limit);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="space-y-8 md:space-y-12  my-5">
      <section className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {products?.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      {/* Error Message */}
      {!loading && products?.data.length === 0 && (
        <div className="container mx-auto px-4 text-red-600 font-bold">
          No products found.
        </div>
      )}
      {products?.meta?.pagination?.totalPages > 1 &&
        products?.data?.length > 0 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={
                    page === 1
                      ? "text-black pointer-events-none opacity-50"
                      : "text-black"
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: products.meta.pagination.totalPages },
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setPage(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        page === index + 1
                          ? "bg-primary text-white"
                          : "hover:bg-muted text-black"
                      }`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, products.meta.pagination.totalPages)
                    )
                  }
                  className={
                    page === products.meta.pagination.totalPages
                      ? "text-black pointer-events-none opacity-50"
                      : "text-black"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
    </div>
  );
};

export default Products;
