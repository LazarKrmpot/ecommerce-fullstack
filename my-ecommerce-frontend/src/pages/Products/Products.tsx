import ProductCard from "@/components/ProductCard";
import { useProductsData } from "@/hooks";
import Pagination from "@/components/CustomPagination"; // Updated import
import React, { useEffect, useState } from "react";

const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const { products, fetchProducts, loading } = useProductsData(page, perPage);

  useEffect(() => {
    fetchProducts();
  }, [page, perPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when perPage changes
  };

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
      {products?.meta?.pagination?.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={products.meta.pagination.totalPages}
          onPageChange={handlePageChange}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
        />
      )}
    </div>
  );
};

export default Products;
