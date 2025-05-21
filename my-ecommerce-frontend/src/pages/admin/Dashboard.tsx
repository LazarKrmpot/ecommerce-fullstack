import { Sidebar } from "./components/Sidebar/Sidebar";

import { AdminRoutes } from "@/routes/adminRoutes";
import { FC } from "react";

const Dashboard: FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 pt-8">
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
