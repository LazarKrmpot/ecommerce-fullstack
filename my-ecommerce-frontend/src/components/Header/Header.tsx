import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "@/components/ui/button";
import MobileMenu from "../Layout/MobileMenu";
import { User } from "@/models/user";
import { ROUTES } from "@/constants/routes";
import { useIsMobile } from "@/hooks/use-mobile";
import { Cart } from "./components/Cart/Cart";

const Header = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return currentLocation.pathname === path;
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to={ROUTES.HOME}
                className="text-xl font-bold text-gray-900 hover:text-red-700"
              >
                MotoShop
              </Link>
            </div>
            <div className="hidden sm:ml-6 md:flex sm:space-x-8">
              <Link
                to={ROUTES.HOME}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive(ROUTES.HOME)
                    ? "border-b-2 border-red-500 text-red-700 hover:text-red-700"
                    : "border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive(ROUTES.PRODUCTS)
                    ? "border-b-2 border-red-500 text-red-700 hover:text-red-700"
                    : "border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700"
                }`}
              >
                Products
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 md:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4 mr-4">
                {user.role === "admin" && (
                  <Link
                    to={ROUTES.ADMIN.DASHBOARD}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(ROUTES.ADMIN.DASHBOARD)
                        ? "border-b-2 border-red-500 text-red-700 hover:text-red-700"
                        : "border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to={ROUTES.PROFILE}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(ROUTES.PROFILE)
                      ? "border-b-2 border-red-500 text-red-700 hover:text-red-700"
                      : "border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700"
                  }`}
                >
                  Profile
                </Link>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive(ROUTES.LOGIN)
                    ? "border-b-2 border-red-500 text-red-700 hover:text-red-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Button
                  variant="outline"
                  className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Cart />
          </div>
          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex space-x-2">
              <Cart />
              <MobileMenu
                isActive={isActive}
                user={user as User}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>

        {/* Mobile menu */}
      </nav>
    </header>
  );
};

export default Header;
