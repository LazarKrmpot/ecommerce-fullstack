import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../models/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import { Separator } from "./ui/separator";
import { useCartStore } from "@/store/cartStore";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: null, // Assuming you have an images array
      stock: product.stock,
    });
  };

  const formattedPrice = `${product.currency} ${product.price}`;
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500";
      case "low stock":
        return "bg-yellow-500";
      case "out of stock":
        return "bg-red-500";
      case "discontinued":
        return "bg-gray-500";
      case "preorder":
        return "bg-blue-500";
      case "coming soon":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className="w-full pb-3 pt-0 max-w-sm overflow-hidden transition-all duration-200 ease-in-out  hover:shadow-lg">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square w-full overflow-hidden bg-neutral-50">
          <div className="flex h-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-neutral-300"
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
        <CardHeader className="px-3 my-3 gap-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold line-clamp-2 h-14">
                {product.name}
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {product.categoryId.name}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                product.status
              )} text-white ml-2 flex-shrink-0`}
            >
              {product.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 px-3">
          <div className="mt-4 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating}
            </span>
          </div>
        </CardContent>
        <Separator />
      </Link>
      <CardFooter className="pt-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold">{formattedPrice}</p>
          <p className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="cursor-pointer rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
