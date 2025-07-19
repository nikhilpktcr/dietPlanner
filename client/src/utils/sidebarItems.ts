import { ISidebarRoute } from "../interface/interface";
import { roles } from "../interface/role";

export const sidebarRouteList: Record<
  roles,
  (ISidebarRoute & { icon: string })[]
> = {
  admin: [
    {
      name: "Dashboard",
      link: "/admin-dashboard",
      icon: "HomeIcon",
    },
    {
      name: "Profile",
      link: "/profile",
      icon: "UserCircleIcon",
    },
    {
      name: "Meal Management",
      link: "/admin/meals",
      icon: "ClipboardDocumentListIcon",
    },
    {
      name: "Logout",
      link: "/logout",
      icon: "ArrowLeftOnRectangleIcon",
    },
    {
      name: "Test",
      link: "/test",
      icon: "WrenchScrewdriverIcon",
    },
  ],
  user: [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: "HomeModernIcon",
    },
    {
      name: "Profile",
      link: "/profile",
      icon: "IdentificationIcon",
    },
    {
      name: "Diet Plan",
      link: "/diet",
      icon: "ClipboardIcon",
    },
    {
      name: "BMI Logs",
      link: "/bmi-logs",
      icon: "ChartBarIcon",
    },
    {
      name: "Logout",
      link: "/logout",
      icon: "PowerIcon",
    },
  ],
  guest: [],
};
