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
import { Trash2 } from "lucide-react";

interface DeleteAddressProps {
  id: string;
  onDelete: (id: string) => void;
  isPrimary?: boolean;
}

export default function DeleteAddress({
  id,
  onDelete,
  isPrimary,
}: DeleteAddressProps) {
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
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete the address
            and remove it from your profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isPrimary && (
            <AlertDialogDescription className="text-red-600 text-xs">
              This address is set as primary. Deleting it will require you to
              set another address as primary.
            </AlertDialogDescription>
          )}

          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 transition-all hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
