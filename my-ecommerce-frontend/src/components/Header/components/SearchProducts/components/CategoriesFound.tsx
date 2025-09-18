import { CategorySearch } from "@/models/product";
import { Link } from "react-router-dom";

interface CategoriesFoundProps {
  categories: CategorySearch[];
  onClick: () => void;
}

const CategoriesFound = ({ categories, onClick }: CategoriesFoundProps) => {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="px-3 py-2 text-xs text-blue-700 bg-blue-50 border-b flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.categoryId._id}
          className="inline-flex items-center gap-1 bg-blue-100 rounded px-2 py-0.5"
          to={`/category/${cat.categoryId._id}`}
          onClick={onClick}
        >
          <span className="font-semibold">{cat.categoryId.name}</span>
          <span className="text-blue-500">({cat.itemsFound})</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesFound;
