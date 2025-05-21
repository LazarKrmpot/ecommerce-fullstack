import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import bannerImage from "../assets/XtreamMotoShopBaner.jpg";
import bannerImage2 from "../assets/cropBanner.webp";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CategoryCard from "@/components/CategoryCard";
import { useCategories } from "@/hooks/categories/useCategories";
import { useFeaturedProducts } from "@/hooks";

const Home: React.FC = () => {
  const {
    products,
    loading: loadingProducts,
    error: productsError,
    fetchFeaturedProducts,
  } = useFeaturedProducts();
  const { categories, isLoadingCategories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, [fetchFeaturedProducts, fetchCategories]);

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <section>
        <div className="relative w-full h-screen overflow-hidden">
          <img
            src={bannerImage}
            alt="Xtream Moto Shop Banner"
            className="w-full h-full object-cover"
          />
          <img
            src={bannerImage2}
            alt="Overlay Image"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center justify-center text-white p-8 space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in">
              Welcome to Xtream Moto Shop
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wider text-red-400 animate-slide-up">
              SUN'S SHINING, YOU'RE RIDING
            </h2>
            <p className="text-lg md:text-xl max-w-2xl text-center text-gray-200 animate-slide-up-delayed">
              New season, fresh roads — ride protected and comfortable.
            </p>
            <Link
              to="/products"
              className="mt-8 px-8 py-3 bg-red-500 text-black font-bold rounded-full hover:text-white
                       hover:bg-red-700 transition-all duration-300 transform hover:scale-105
                       animate-fade-in-delayed"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {productsError && (
        <div className="container mx-auto px-4 text-red-600 font-bold">
          {productsError}
        </div>
      )}

      {/* Featured Products */}
      <section className="container w-full flex-rows justify-center items-center mx-auto px-4 md:px-6">
        {loadingProducts ? (
          <div className="flex justify-center">
            <p>Loading products...</p>
          </div>
        ) : productsError ? (
          <div className="text-red-600 font-bold">{productsError}</div>
        ) : (
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {products.data.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex justify-center"
                >
                  <div className="w-full max-w-sm">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
        <div className="flex justify-center">
          <Link
            to="/products"
            className="mt-10 px-8 py-3 bg-red-500 text-black font-bold rounded-full hover:text-white
                       hover:bg-red-700 transition-all duration-300 transform hover:scale-105
                       animate-fade-in-delayed"
          >
            View All
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-6">Shop by Categories</h2>
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.map((category) => (
              <CategoryCard category={category} key={category._id} />
            ))}
          </div>
        )}
      </section>

      {/* Informative Section */}
      <section className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-700 text-base md:text-lg">
              At My E-commerce Store, we offer the best selection of motorcycle
              gear and parts, carefully curated for quality, performance, and
              safety. Our knowledgeable team is passionate about riding and
              dedicated to providing an exceptional shopping experience.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
