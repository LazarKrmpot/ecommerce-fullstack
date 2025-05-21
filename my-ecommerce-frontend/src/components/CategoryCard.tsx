import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Category } from "@/models/category";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category._id}`} className="block w-full">
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <CardContent className="flex h-full flex-col items-center justify-center p-6">
          <div className="mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30 p-3 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
            <Package className="h-8 w-8" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-primary">
              {category.name}
            </h3>
            <div className="mt-2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
