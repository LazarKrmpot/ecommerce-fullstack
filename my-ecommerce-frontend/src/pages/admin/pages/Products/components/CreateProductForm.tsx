import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PackagePlus, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/models/category";
import { ResponsiveForm } from "@/components/ResponsiveForm";
import { CreateProductPayload } from "@/models/product";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreateProductFormProps {
  categories: Category[];
  onSubmit: (data: CreateProductPayload) => Promise<void>;
  isLoadingCategories?: boolean;
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  categories,
  onSubmit,
  isLoadingCategories = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    stock: "",
    isFeatured: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseFloat(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: numValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const createProductData: CreateProductPayload = {
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isFeatured: formData.isFeatured,
      };
      await onSubmit(createProductData);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setFormData({
        name: "",
        categoryId: "",
        description: "",
        price: "",
        stock: "",
        isFeatured: false,
      });
    }
  };

  const trigger = isMobile ? (
    <Button
      variant="outline"
      size="icon"
      className="fixed h-15 w-15 z-10 bottom-5 right-5 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
    >
      <PackagePlus className="!h-7 !w-7" />
    </Button>
  ) : (
    <Button
      variant="outline"
      className="h-9 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
    >
      Create Product
    </Button>
  );

  return (
    <ResponsiveForm
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Create Product"
      description="Add a new product to your store"
      customTrigger={trigger}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleTextChange}
              className="transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  categoryId: value,
                })
              }
              disabled={isLoadingCategories}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleTextChange}
              className="min-h-[100px] resize-y transition-all duration-200"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={handleNumberChange}
                className="transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={formData.stock}
                onChange={handleNumberChange}
                className="transition-all duration-200"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isFeatured" className="text-sm font-medium">
                Featured Product
              </Label>
              <p className="text-xs text-muted-foreground">
                Featured products appear prominently on the home page
              </p>
            </div>
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked: boolean) =>
                setFormData({
                  ...formData,
                  isFeatured: checked,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className={cn(
              "transition-all duration-200",
              isLoading && "opacity-50"
            )}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "transition-all duration-200",
              isLoading && "opacity-50"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </ResponsiveForm>
  );
};
