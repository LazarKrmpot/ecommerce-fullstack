import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";

export const menuItems = [
  { title: "Overview", icon: LayoutDashboard, path: ROUTES.ADMIN.DASHBOARD },
  { title: "Users", icon: Users, path: `${ROUTES.ADMIN.DASHBOARD}/users` },
  {
    title: "Products",
    icon: Package,
    path: `${ROUTES.ADMIN.DASHBOARD}/${ROUTES.ADMIN.RELATIVE.PRODUCTS}`,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: `${ROUTES.ADMIN.DASHBOARD}/${ROUTES.ADMIN.RELATIVE.ORDERS}`,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: `${ROUTES.ADMIN.DASHBOARD}/${ROUTES.ADMIN.RELATIVE.ANALYTICS}`,
  },
  {
    title: "Settings",
    icon: Settings,
    path: `${ROUTES.ADMIN.DASHBOARD}/${ROUTES.ADMIN.RELATIVE.SETTINGS}`,
  },
];
