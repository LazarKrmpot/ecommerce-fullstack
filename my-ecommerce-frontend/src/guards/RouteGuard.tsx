// src/guards/RouteGuard.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

interface RouteGuardProps {
  children: ReactNode;
  roles?: string[];
  fallback?: ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  roles = [],
  fallback,
}) => {
  const location = useLocation();
  fallback = fallback || (
    <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  );
  const { user, loading } = useAuthStore();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  if (!user) {
    return fallback;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
