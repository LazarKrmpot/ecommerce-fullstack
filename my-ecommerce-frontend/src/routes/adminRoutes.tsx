import { ROUTES } from "@/constants/routes";
import { Orders } from "@/pages/admin/pages/Orders/Orders";
import { Overview } from "@/pages/admin/pages/Overview/Overview";
import { Products } from "@/pages/admin/pages/Products/Products";
import { Users } from "@/pages/admin/pages/Users/Users";
import { Route, Routes } from "react-router-dom";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path={ROUTES.ADMIN.RELATIVE.USERS} element={<Users />} />
      <Route path={ROUTES.ADMIN.RELATIVE.PRODUCTS} element={<Products />} />
      <Route path={ROUTES.ADMIN.RELATIVE.ORDERS} element={<Orders />} />
      <Route
        path={ROUTES.ADMIN.RELATIVE.ANALYTICS}
        element={
          <div className="text-center text-muted-foreground">
            Analytics dashboard coming soon
          </div>
        }
      />
      <Route
        path={ROUTES.ADMIN.RELATIVE.SETTINGS}
        element={
          <div className="text-center text-muted-foreground">
            Settings page coming soon
          </div>
        }
      />
    </Routes>
  );
};
