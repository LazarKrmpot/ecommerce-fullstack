import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import { Toaster } from "sonner";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">MotoShop</h3>
              <p className="text-gray-400 mt-2">
                Your one-stop shop for all your motorcycle needs
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} MotoShop. All rights reserved.
          </div>
        </div>
      </footer>
      <Toaster richColors />
    </div>
  );
};

export default Layout;
