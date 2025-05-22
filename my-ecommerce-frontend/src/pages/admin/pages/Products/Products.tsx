import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateProductPayload, UpdateProductPayload } from "@/models/product";
import { Input } from "@/components/ui/input";
import {
  updateProduct,
  getFeaturedProducts,
  deleteProduct,
  createProduct,
} from "@/services/productsService";
import { useEffect, useState } from "react";

import { ProductFilter } from "@/models/productFilters";

import { EditProductForm } from "./components/EditProductForm";
import { toast } from "sonner";
import { ProductStats } from "./components/ProductStats";
import DeleteProduct from "./components/DeleteProduct";
import { SearchIcon } from "lucide-react";
import { CreateProductForm } from "./components/CreateProductForm";
import {
  useCategories,
  useProductsData,
  useProductSearch,
  useProductStats,
} from "@/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UploadProducts } from "./components/UploadProducts/UploadProducts";

export const Products = () => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [activeFilter, setActiveFilter] = useState<ProductFilter>(
    ProductFilter.ALL
  );

  const { products, fetchProducts, setProducts, loading } = useProductsData(
    page,
    limit
  );
  const { stats, statsLoading, fetchStats } = useProductStats();
  const { categories, isLoadingCategories, fetchCategories } = useCategories();
  const { handleSearch, isSearching } = useProductSearch(setProducts);

  console.log("RERENDERING PRODUCTS");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page]);

  useEffect(() => {
    fetchStats();
  }, []);

  const filterProducts = async (filter: ProductFilter): Promise<void> => {
    switch (filter) {
      case ProductFilter.ALL:
        setActiveFilter(filter);
        fetchProducts();
        break;
      case ProductFilter.IN_STOCK:
        setActiveFilter(filter);
        fetchProducts();
        setProducts((prev) => ({
          ...prev,
          data: prev.data.filter((product) => product.stock > 0),
        }));
        break;
      case ProductFilter.OUT_OF_STOCK:
        setActiveFilter(filter);
        setProducts((prev) => ({
          ...prev,
          data: prev.data.filter((product) => product.stock === 0),
        }));
        break;
      case ProductFilter.FEATURED:
        try {
          const featuredProducts = await getFeaturedProducts();
          setActiveFilter(filter);
          setProducts(featuredProducts);
        } catch (error) {
          console.error("Error fetching featured products:", error);
          toast.error("Error fetching featured products");
        }
        break;
      default:
        setActiveFilter(filter);
        fetchProducts();
        break;
    }
  };

  const handleUpdateProduct = async (
    updatedProduct: UpdateProductPayload
  ): Promise<void> => {
    const productId = updatedProduct._id;
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    try {
      const savedProduct = await updateProduct(productId, updatedProduct);
      setProducts((prev) => ({
        ...prev,
        data: prev.data.map((p) =>
          p._id === savedProduct._id ? savedProduct : p
        ),
      }));
      await fetchStats();
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);

      setProducts((prev) => ({
        ...prev,
        data: prev.data.filter((p) => p._id !== id),
        meta: {
          ...prev.meta,
          pagination: {
            ...prev.meta.pagination,
            totalResults: prev.meta.pagination.totalResults - 1,
          },
        },
      }));

      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      fetchStats();
    }
  };

  const handleCreateProduct = async (productData: CreateProductPayload) => {
    try {
      await createProduct(productData);

      setProducts((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          pagination: {
            ...prev.meta.pagination,
            totalResults: prev.meta.pagination.totalResults + 1,
          },
        },
      }));
      toast.success("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    } finally {
      fetchStats();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductStats
          stats={stats}
          loading={statsLoading}
          onFilter={filterProducts}
          activeFilter={activeFilter}
        />
        <section className="flex flex-col sm:flex-row items-center gap-4">
          <form className="w-full">
            <div className="flex flex-col gap-3 py-4 w-full md:w-1/2 lg:w-1/3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                </span>
                <Input
                  id="search"
                  placeholder="Search products..."
                  onChange={handleSearch}
                  className="w-full pl-10"
                  disabled={isSearching}
                />
              </div>
            </div>
          </form>
          <UploadProducts getStats={fetchStats} />
          <CreateProductForm
            categories={categories}
            onSubmit={handleCreateProduct}
            isLoadingCategories={isLoadingCategories}
          />
        </section>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.data?.length > 0 ? (
                products?.data?.map((product) => (
                  <TableRow className="text-left" key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.categoryId.name}</TableCell>
                    <TableCell>
                      {product.currency} {product.price}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isFeatured ? "default" : "secondary"}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right gap-2 flex justify-end">
                      <EditProductForm
                        product={product}
                        onSave={handleUpdateProduct}
                        categories={categories}
                        isLoadingCategories={isLoadingCategories}
                      />
                      <DeleteProduct
                        id={product._id}
                        onDelete={handleDeleteProduct}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
      </CardContent>
    </Card>
  );
};
