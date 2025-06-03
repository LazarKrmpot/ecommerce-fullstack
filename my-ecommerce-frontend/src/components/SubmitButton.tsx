import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  customClassName?: string;
  onSubmit?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  isLoading = false,
  disabled = false,
  customClassName = "",
  onSubmit = () => {},
}) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isLoading && "opacity-50",
        disabled && "pointer-events-none opacity-50",
        customClassName,
        "w-full sm:w-fit"
      )}
      onClick={onSubmit}
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
          {label}
        </span>
      )}
    </Button>
  );
};
