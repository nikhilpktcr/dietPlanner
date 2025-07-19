import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/Layout/MainLayout";
import Test from "../pages/Test";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UserProfilePage = lazy(() => import("../pages/users/UserProfile"));
const UserDietPage = lazy(() => import("../pages/users/UserDiet"));
const BmiLogPage = lazy(() => import("../pages/users/BmiLog"));
const AdminMealsPage = lazy(() => import("../pages/admin/AdminMeals"));
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/page-not-found", element: <div>page not found</div> },

  {
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/profile", element: <UserProfilePage /> },
          { path: "/diet", element: <UserDietPage /> },
          { path: "/bmi-logs", element: <BmiLogPage /> },
          {
            path: "/test",
            element: (
              <>
                <Test />
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/admin-dashboard", element: <AdminDashboard /> },
          { path: "/profile", element: <UserProfilePage /> },
          { path: "/admin/meals", element: <AdminMealsPage /> },
          { path: "/test", element: <>Test</> },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/page-not-found" replace /> },
]);

export default router;
