import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validateCsvHeaders } from "@/lib/csvValidator";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  FileWarning,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type UploadStatus = "idle" | "checking" | "invalid" | "valid" | "error";

interface CsvUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export function CsvUploader({ onUpload, isLoading }: CsvUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [productCount, setProductCount] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const requiredHeaders = [
    "name",
    "description",
    "price",
    "stock",
    "isFeatured",
    "categoryId",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setStatus("idle");
    setDragActive(false);
    setErrorMessage("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const processCsvFile = async (file: File) => {
    if (file.type !== "text/csv") {
      setErrorMessage("Invalid file type. Please upload a CSV file.");
      setStatus("error");
      return;
    }

    setStatus("checking");

    try {
      const text = await file.text();
      const validation = validateCsvHeaders(text, requiredHeaders);

      if (validation.isValid) {
        setStatus("valid");
        setProductCount(validation.productCount);
        toast.success("CSV file is valid and ready for upload.");
      } else {
        setStatus("invalid");
        setErrorMessage(
          `CSV file is invalid. Please check these headers: ${requiredHeaders.join(
            ", "
          )}`
        );
        toast.error(
          `CSV file is invalid. Please check these headers: ${requiredHeaders.join(
            ", "
          )}`
        );
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Error processing CSV file");
      console.error(error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processCsvFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processCsvFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (status === "valid" && file) {
      // Here you would implement the actual upload logic to your server
      onUpload(file);
      toast.success("CSV file uploaded successfully!");

      // Reset after successful upload
      resetUploader();
    } else {
      toast.error("Please select a valid CSV file before uploading.");
      setStatus("error");
      setErrorMessage("Please select a valid CSV file before uploading.");
      console.error("Please select a valid CSV file before uploading.");
      return;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Products CSV</CardTitle>
        <CardDescription>
          Drag and drop your CSV file or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-4 text-center",
            dragActive ? "border-primary bg-primary/5" : "border-border",
            status === "valid" &&
              "border-green-500 bg-green-50 dark:bg-green-950/20",
            status === "invalid" &&
              "border-red-500 bg-red-50 dark:bg-red-950/20",
            status === "error" && "border-red-500 bg-red-50 dark:bg-red-950/20"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            id="csv-upload"
            accept=".csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {status === "idle" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">
                  Choose a CSV file or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  CSV must include: name, description, price, stock, isFeatured,
                  categoryId
                </p>
              </div>
            </>
          )}

          {status === "checking" && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-pulse">
                <svg
                  className="animate-spin h-10 w-10 text-primary"
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
              </div>
              <p className="font-medium">Validating CSV headers...</p>
            </div>
          )}

          {status === "valid" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium mb-1">CSV file is valid!</p>
                <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                  <span>{file?.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                  <span>{formatFileSize(file?.size || 0)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                  <span>{productCount} products</span>
                </div>
              </div>
            </>
          )}

          {(status === "invalid" || status === "error") && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                {status === "invalid" ? (
                  <FileWarning className="h-8 w-8 text-red-600 dark:text-red-400" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium mb-1">Error with CSV file</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetUploader}
          disabled={status === "idle" || status === "checking"}
        >
          Reset
        </Button>
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
          <Button
            onClick={handleUpload}
            disabled={status !== "valid"}
            className={cn(
              status === "valid" && "bg-green-600 hover:bg-green-700"
            )}
          >
            Upload Products
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
