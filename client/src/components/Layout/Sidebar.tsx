import React from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarRouteList } from "../../utils/sidebarItems";
import { roles } from "../../interface/role";
import { logout } from "../../utils/logout";

// Import only the icons you use in iconMap
import {
  HomeIcon,
  HomeModernIcon,
  UserIcon,
  UserCircleIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  BeakerIcon,
  ChartBarIcon,
  ClipboardIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

// Icon name to component map (ensure all used icons are covered)
const iconMap: Record<string, React.ElementType> = {
  HomeIcon,
  HomeModernIcon,
  UserIcon,
  UserCircleIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  BeakerIcon,
  ChartBarIcon,
  ClipboardIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  PowerIcon,
};

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const location = useLocation();

  // Safe user parsing from localStorage - moved inside component
  const [user, setUser] = React.useState<{ token: string; role: roles } | null>(
    null
  );

  React.useEffect(() => {
    const updateUser = () => {
      try {
        const userString = localStorage.getItem("user");
        const parsedUser = userString ? JSON.parse(userString) : null;
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        setUser(null);
      }
    };

    // Initial load
    updateUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        updateUser();
      }
    };

    // Listen for custom logout event
    const handleLogout = () => {
      updateUser();
    };

    // Listen for custom login event
    const handleLogin = () => {
      updateUser();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLogout", handleLogout);
    window.addEventListener("userLogin", handleLogin);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogout", handleLogout);
      window.removeEventListener("userLogin", handleLogin);
    };
  }, []);

  const role: roles = user?.role || "guest";

  // Debug logging
  console.log("Sidebar - User:", user);
  console.log("Sidebar - Role:", role);
  console.log("Sidebar - Available roles:", Object.keys(sidebarRouteList));
  console.log("Sidebar - Routes for role:", sidebarRouteList[role]);
  console.log("Sidebar - localStorage user:", localStorage.getItem("user"));

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-100 p-6 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 shadow-2xl rounded-r-2xl`}
    >
      <h2 className="text-indigo-700 text-2xl font-extrabold mb-8 tracking-wide flex items-center gap-2">
        <span className="inline-block bg-indigo-500 p-2 rounded-full">
          <HomeIcon className="w-7 h-7 text-white" />
        </span>
        DietPlanner
      </h2>

      <nav className="space-y-2">
        {sidebarRouteList[role]?.map((route) => {
          const Icon = iconMap[route.icon];
          return (
            <SidebarLink
              key={route.link}
              to={route.link}
              label={route.name}
              icon={Icon}
              currentPath={location.pathname}
              onClick={route.name === "Logout" ? logout : undefined}
            />
          );
        })}
        {(!sidebarRouteList[role] || sidebarRouteList[role].length === 0) && (
          <div className="text-gray-500 text-sm p-4">
            No menu items available for role: {role}
          </div>
        )}
      </nav>
    </div>
  );
};

const SidebarLink: React.FC<{
  to: string;
  label: string;
  icon?: React.ElementType;
  currentPath: string;
  onClick?: () => void;
}> = ({ to, label, icon: Icon, currentPath, onClick }) => {
  const isActive = currentPath === to;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-all duration-200 group text-lg ${
        isActive
          ? "bg-indigo-100 text-indigo-700 shadow-md"
          : "text-indigo-700 hover:bg-indigo-50 hover:pl-6"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-6 h-6 ${
            isActive
              ? "text-indigo-700"
              : "text-indigo-400 group-hover:text-indigo-700"
          }`}
        />
      )}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;
