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

import { CreateProductPayload, UpdateProductPayload } from "@/models/product";
import { Input } from "@/components/ui/input";
import { updateProduct, deleteProduct, createProduct } from "@/services/productsService";
import { useEffect, useState } from "react";

import { ProductFilter } from "@/models/productFilters";

import { EditProductForm } from "./components/EditProductForm";
import { toast } from "sonner";
import { ProductStats } from "./components/ProductStats";
import DeleteProduct from "./components/DeleteProduct";
import { SearchIcon } from "lucide-react";
import { CreateProductForm } from "./components/CreateProductForm";
import { ProductsTableSkeleton } from "./components/ProductsTableSkeleton";
import {
  useCategories,
  useProductsData,
  useProductSearch,
  useProductStats,
} from "@/hooks";
import Pagination from "@/components/CustomPagination";
import { UploadProducts } from "./components/UploadProducts/UploadProducts";
import { createCategory } from "@/services/categoriesService";
import { CategoryRequest } from "@/models/category";

export const Products = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>(
    ProductFilter.ALL
  );

  const { products, fetchProducts, setProducts, loading } = useProductsData(
    page,
    perPage,
    activeFilter === ProductFilter.FEATURED ? "isFeatured::eq::true" : undefined
  );
  const { stats, statsLoading, fetchStats } = useProductStats();
  const { categories, setCategories, isLoadingCategories, fetchCategories } =
    useCategories();
  const { handleSearch, isSearching } = useProductSearch(setProducts);

  console.log("RERENDERING PRODUCTS");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, perPage, activeFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  const filterProducts = async (filter: ProductFilter): Promise<void> => {
    switch (filter) {
      case ProductFilter.ALL:
        setActiveFilter(filter);
        setPage(1);
        break;
      case ProductFilter.IN_STOCK:
        setActiveFilter(filter);
        setPage(1);
        await fetchProducts();
        setProducts((prev) => ({
          ...prev,
          data: prev.data.filter((product) => product.stock > 0),
        }));
        break;
      case ProductFilter.OUT_OF_STOCK:
        setActiveFilter(filter);
        setPage(1);
        setProducts((prev) => ({
          ...prev,
          data: prev.data.filter((product) => product.stock === 0),
        }));
        break;
      case ProductFilter.FEATURED:
        setActiveFilter(filter);
        setPage(1);
        break;
      default:
        setActiveFilter(filter);
        setPage(1);
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

  const handleCreateCategory = async (category: CategoryRequest) => {
    console.log("Creating category:", category);

    try {
      const newCategory = await createCategory(category);
      setCategories((prev) => [
        ...prev,
        {
          _id: newCategory._id,
          name: newCategory.name,
          description: newCategory.description,
        },
      ]);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
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
            onCreateCategory={handleCreateCategory}
          />
        </section>
        {loading ? (
          <ProductsTableSkeleton />
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
                        isFeatured={product.isFeatured}
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
        {products?.meta?.pagination?.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={products.meta.pagination.totalPages}
            onPageChange={handlePageChange}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};
