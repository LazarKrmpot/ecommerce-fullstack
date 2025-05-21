import { RouteObject } from "react-router-dom";
import Home from "@/pages/Home";
import Products from "@/pages/Products/Products";
import ProductDetail from "@/pages/ProductDetail";
import CategoryProducts from "@/pages/CategoryProducts/CategoryProducts";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";

export const publicRoutes: RouteObject[] = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.PRODUCTS, element: <Products /> },
  { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetail /> },
  { path: ROUTES.CATEGORY, element: <CategoryProducts /> },
  { path: ROUTES.LOGIN, element: <Login /> },
  { path: ROUTES.REGISTER, element: <Register /> },
  { path: ROUTES.UNAUTHORIZED, element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
];
