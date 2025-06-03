import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderDashboardProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  toggleSidebar,
  isCollapsed,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 pt-8 pl-8 pr-8">
      <section className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 mb-0 bg-gray-200 hover:bg-gray-300 transition-all ease-in-out"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Control Center</h2>
      </section>
    </header>
  );
};

export default HeaderDashboard;
