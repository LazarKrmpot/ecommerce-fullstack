import { Product, UpdateProductPayload } from "@/models/product";
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
import { cn } from "@/lib/utils";
import { Category } from "@/models/category";
import { ResponsiveForm } from "@/components/ResponsiveForm";
import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

interface UpdateProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  categoryId?: string;
}

interface EditProductFormProps {
  product: Product;
  onSave: (updatedProduct: UpdateProductPayload) => Promise<void>;
  categories: Category[];
  isLoadingCategories: boolean;
}

export const EditProductForm = ({
  product,
  onSave,
  categories,
  isLoadingCategories,
}: EditProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const initialValues: UpdateProductForm = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId._id,
  };

  const [formData, setFormData] = useState<UpdateProductForm>(initialValues);

  const hasChanges = () => {
    return Object.keys(initialValues).some(
      (key) =>
        initialValues[key as keyof UpdateProductForm] !==
        formData[key as keyof UpdateProductForm]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProduct: UpdateProductPayload = {
        _id: product._id,
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        isFeatured: formData.isFeatured,
      };

      await onSave(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
      toggleDialog();
    }
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

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : parseFloat(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: numValue,
    }));
  };

  return (
    <ResponsiveForm
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Edit Product"
      description="Edit product details"
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

          <SubmitButton
            label="Save Changes"
            isLoading={isLoading}
            disabled={!hasChanges() || isLoading}
          />
        </div>
      </form>
    </ResponsiveForm>
  );
};
