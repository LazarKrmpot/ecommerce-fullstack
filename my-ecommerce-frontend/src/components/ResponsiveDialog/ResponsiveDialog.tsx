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

interface ResponsiveDialogProps {
  title: string;
  description: string;
  triggerIcon?: React.ReactNode;
  headerChildren?: React.ReactNode;
  customTrigger?: React.ReactNode;
  children: React.ReactNode;
  handleOpenDialog?: () => void;
  isOpen?: boolean;
  classNames?: string;
  disabled?: boolean;
}

export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  title,
  description,
  triggerIcon = <Edit className="h-4 w-4" />,
  headerChildren,
  customTrigger,
  children,
  handleOpenDialog,
  isOpen = false,
  classNames = "",
  disabled = false,
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenDialog}>
        <DialogTrigger asChild disabled={disabled}>
          {customTrigger ? (
            customTrigger
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
              disabled={disabled}
            >
              {triggerIcon}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className={classNames}>
          <DialogHeader className="mt-4 flex md:flex-row space-y-2 justify-between items-center">
            <div className="flex flex-col space-y-2">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
            {headerChildren}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenDialog}>
      <DrawerTrigger asChild disabled={disabled}>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            disabled={disabled}
          >
            {triggerIcon}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex space-y-2 justify-between">
          <div>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </div>
          {headerChildren}
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-2">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
