import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import { ROUTES } from "@/constants/routes";
import { menuItems } from "@/pages/admin/components/Sidebar/sidebarMenuItems";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useState } from "react";

interface MobileMenuProps {
  user: User | null;
  onLogout: () => void;
  isActive: (path: string) => boolean;
}

const MobileMenu = ({ user, onLogout, isActive }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          onClick={handleToggle}
          aria-label="Menu"
          size="icon"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
        >
          <span className="sr-only">Open main menu</span>

          <Menu className="block h-6 w-6" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="py-0 display-none">
          <DrawerTitle className="text-lg font-bold"></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <div className="pt-2 pb-3 space-y-1 overflow-y-auto ">
          <Link
            to={ROUTES.HOME}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive(ROUTES.HOME)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={handleClose}
          >
            Home
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive(ROUTES.PRODUCTS)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={handleClose}
          >
            Products
          </Link>

          {!user && (
            <Link
              to={ROUTES.LOGIN}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(ROUTES.LOGIN)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={handleClose}
            >
              Sign In
            </Link>
          )}
          {user && (
            <>
              <Link
                to={ROUTES.PROFILE}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.PROFILE)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={handleClose}
              >
                Profile
              </Link>
              <Button onClick={handleLogout}>Sign Out</Button>
            </>
          )}
          {user?.role === "admin" && (
            <section className="space-y-1 my-4">
              <p className="text-2xl pl-1">Dashboard</p>
              {menuItems.map(({ title, icon: Icon, path }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={handleClose}
                    className="hover:bg-accent"
                  >
                    <Button
                      variant="secondary"
                      className={cn(
                        "w-full justify-start gap-2 transition-all duration-200 bg-white",
                        isActive ? "bg-accent" : "bg-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors duration-200",
                          isActive ? "text-red-600" : "text-black",
                          "group-hover:text-red-300"
                        )}
                      />
                      {title}
                    </Button>
                  </Link>
                );
              })}
            </section>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
