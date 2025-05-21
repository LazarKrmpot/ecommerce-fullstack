// src/routes/protectedRoutes.tsx
import { RouteObject } from "react-router-dom";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/admin/Dashboard";
import { ROUTES } from "@/constants/routes";
import RouteGuard from "@/guards/RouteGuard";

export const protectedRoutes: RouteObject[] = [
  {
    path: ROUTES.PROFILE,
    element: (
      <RouteGuard roles={["user", "admin"]}>
        <Profile />
      </RouteGuard>
    ),
  },
  {
    path: `${ROUTES.ADMIN.DASHBOARD}/*`,
    element: (
      <RouteGuard roles={["admin"]}>
        <Dashboard />
      </RouteGuard>
    ),
  },
];
