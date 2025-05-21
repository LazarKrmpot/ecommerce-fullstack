import ProductCard from "@/components/ProductCard";
import { Category } from "@/models/category";
import { Product } from "@/models/product";
import { getProductsByCategory } from "@/services/productsService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setError("Category ID is required");
      setLoadingProducts(false);
      return;
    }
    getProductsByCategory(id)
      .then((data) => {
        setProducts(data);
        setSelectedCategory(data[0]?.categoryId);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setLoadingProducts(false);
      });
  }, [id]);

  return (
    <div className="space-y-8 md:space-y-12  my-5">
      <section className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory ? selectedCategory.name : "Products"}
          </h2>
          <p className="text-gray-600">
            {selectedCategory ? selectedCategory.description : "All Products"}
          </p>
        </div>
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-4 text-red-600 font-bold">
          {error}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
