import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { useProfileQuery } from "../../redux/services/authApi";
import {
  UserCircleIcon,
  BellIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

const Header: React.FC<{ onSidebarToggle?: () => void }> = ({
  onSidebarToggle,
}) => {
  // const { data } = useProfileQuery();
  const data = {
    name: "nikhil",
  };
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Helper to get user initials
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Hamburger + Logo + App Name */}
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={onSidebarToggle}
            aria-label="Open sidebar"
          >
            <svg
              className="w-7 h-7 text-indigo-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {/* Logo */}
          <span className="bg-indigo-500 rounded-full p-2 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2a4 4 0 018 0v2m-4-6a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0v2H3v-2a6 6 0 016-6z"
              />
            </svg>
          </span>
          <span className="text-indigo-700 text-2xl font-extrabold tracking-wide hidden sm:inline">
            DietPlanner
          </span>
        </div>
        {/* Center: (Optional) Search or nav links */}
        {/* <div className="hidden md:flex flex-1 justify-center"> ... </div> */}
        {/* Right: Notifications, Theme, User Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <BellIcon className="w-6 h-6 text-indigo-700" />
          </button>
          {/* Theme Switcher (placeholder) */}
          <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <Cog6ToothIcon className="w-6 h-6 text-indigo-700" />
          </button>
          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-label="User menu"
            >
              <span className="w-9 h-9 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">
                {data.name ? (
                  getInitials(data.name)
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-indigo-400" />
                )}
              </span>
              <span className="hidden md:inline text-indigo-700 font-semibold max-w-[120px] truncate">
                {data?.name}
              </span>
            </button>
            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
