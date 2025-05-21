import { useIsMobile } from "@/hooks/use-mobile";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface ResponsiveFormProps {
  title: string;
  description: string;
  triggerIcon?: React.ReactNode;
  customTrigger?: React.ReactNode;
  children: React.ReactNode;
  handleOpenDialog?: () => void;
  isOpen?: boolean;
  classNames?: string;
}
export const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  title,
  description,
  triggerIcon = <Edit className="h-4 w-4" />,
  customTrigger,
  children,
  handleOpenDialog,
  isOpen = false,
  classNames = "",
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
        <DialogTrigger asChild>
          {customTrigger ? (
            customTrigger
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            >
              {triggerIcon}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className={classNames}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenDialog}>
      <DrawerTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            {triggerIcon}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
