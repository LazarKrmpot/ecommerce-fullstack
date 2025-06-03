import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { menuItems } from "./sidebarMenuItems";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      {/* Overlay on small screens */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden",
          isCollapsed ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        onClick={() => setIsCollapsed((prev) => !prev)}
      />

      <aside
        className={cn(
          "fixed md:relative rounded-br-md inset-0 border-b z-40 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed
            ? "translate-x-[-100%] md:translate-x-0 w-[60px]"
            : "translate-x-0 w-[250px]",
          "md:static"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-14 items-center px-4",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <h2 className="text-lg font-semibold whitespace-nowrap overflow-hidden">
              Admin Dashboard
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2">
          {menuItems.map(({ title, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className="hover:bg-accent">
                <Button
                  variant="secondary"
                  className={cn(
                    "w-full justify-start gap-2 transition-all duration-200 bg-white",
                    isActive ? "bg-accent" : "bg-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive ? "text-red-600" : "text-black",
                      "group-hover:text-red-300"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap text-black">
                      {title}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
