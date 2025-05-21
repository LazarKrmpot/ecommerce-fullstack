export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/product/:id",
  CATEGORY: "/category/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",
  PROFILE: "/profile",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    RELATIVE: {
      USERS: "users",
      PRODUCTS: "products",
      ORDERS: "orders",
      ANALYTICS: "analytics",
      SETTINGS: "settings",
    },
  },
} as const;
