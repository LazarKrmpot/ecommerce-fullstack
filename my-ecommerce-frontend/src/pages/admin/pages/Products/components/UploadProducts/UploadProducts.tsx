import { Button } from "@/components/ui/button";
import { PackagePlus, Upload } from "lucide-react";
import { useState, useMemo } from "react";
import { ResponsiveForm } from "@/components/ResponsiveForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { CategoryReference } from "./components/CategoryRefrence";
import { CsvFormatGuide } from "./components/CsvFormatGuide";
import { CsvUploader } from "./components/CsvUploader";
import { PageHeader } from "./components/PageHeader";
import { uploadProducts } from "@/services/productsService";
import { toast } from "sonner";

type UploadProductsProps = {
  getStats: () => Promise<void>;
};

export const UploadProducts = ({ getStats }: UploadProductsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile();

  const toggleDialog = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (productsFile: File | null) => {
    setIsLoading(true);

    if (!productsFile) {
      toast.error("Please select a file to upload");
      setIsLoading(false);
      return;
    }
    try {
      const { count } = await uploadProducts(productsFile);
      await getStats();

      toast.success(
        `${count} ${count > 1 ? "Products" : "Product"} uploaded successfully`
      );
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const trigger = useMemo(() => {
    return isMobile ? (
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
        Upload Products
      </Button>
    );
  }, [isMobile]);

  return (
    <ResponsiveForm
      handleOpenDialog={toggleDialog}
      isOpen={isOpen}
      title="Upload Products"
      triggerIcon={<Upload className="h-4 w-4" />}
      description="Form accepts a csv file with the following headers: name, description, price, stock, isFeatured, categoryId"
      customTrigger={trigger}
      classNames="mx-auto py-8 px-4 md:px-6 min-w-[90vw] h-[90vh] overflow-y-auto"
    >
      <PageHeader
        title="Product CSV Upload"
        description="Upload your product data using a CSV file with the required format"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <div className="lg:col-span-8 space-y-6">
          <CsvUploader isLoading={isLoading} onUpload={handleSubmit} />
          <CsvFormatGuide />
        </div>
        <div className="lg:col-span-4">
          <CategoryReference />
        </div>
      </div>
    </ResponsiveForm>
  );
};
