import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteProductProps {
  id: string;
  onDelete: (id: string) => void;
  isFeatured?: boolean;
}

export default function DeleteProduct({
  id,
  onDelete,
  isFeatured,
}: DeleteProductProps) {
  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-red-600 hover:text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <section className="flex flex-col items-center justify-center sm:flex-row sm:justify-between gap-5 w-full">
            {isFeatured && (
              <AlertDialogDescription className="text-red-600 text-[.9rem] sm:text-xs text-center sm:text-left">
                This product is featured
              </AlertDialogDescription>
            )}

            <div className="flex w-full sm:w-fit flex-col sm:flex-row items-center gap-2">
              <AlertDialogCancel className="w-full sm:w-fit">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 w-full sm:w-fit transition-all hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </div>
          </section>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
