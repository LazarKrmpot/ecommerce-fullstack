import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";
import { Product } from "../models/product";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch product details");
          setLoading(false);
        });
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-red-600 font-bold text-xl mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-yellow-600 font-bold text-xl mb-2">
            Product Not Found
          </h2>
          <p className="text-yellow-600">
            We couldn't find the product you're looking for.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Format the price for display
  const formattedPrice = `${product.currency} ${product.price.toFixed(2)}`;
  const isLowStock = product.stock <= 5;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Products
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-800 font-medium truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-2/5">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-3/5 p-6 lg:p-8">
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        isLowStock
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isLowStock ? "Low Stock" : `${product.stock} in stock`}
                    </span>
                  </div>

                  <p className="text-2xl font-semibold text-gray-900 mb-6">
                    {formattedPrice}
                  </p>

                  <div className="prose prose-gray mb-8">
                    <p>{product.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Product Details
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {product.status}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Category</span>
                          <span className="font-medium text-gray-900">
                            {product.categoryId.name}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Stock</span>
                          <span className="font-medium text-gray-900">
                            {product.stock} units
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Shipping
                      </h3>
                      <p className="text-gray-900">
                        Free shipping on orders over $50
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        Estimated delivery: 3-5 business days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center py-2 focus:outline-none"
                      />
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>

                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      Add to Cart
                    </button>

                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium p-3 rounded-md transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-6 text-center sm:text-left">
                    <Link
                      to="/"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
