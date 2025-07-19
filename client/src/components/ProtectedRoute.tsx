import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetUserProfileQuery } from "../redux/services/userProfileApi";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const [isProfileCheckComplete, setIsProfileCheckComplete] = useState(false);
  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user =
      userString && userString !== "undefined" ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    user = null;
  }

  // Get user ID from localStorage
  const userId = user?.userId || user?.id;

  // Only check profile for regular users, not admins
  const shouldCheckProfile =
    allowedRoles.includes("user") && !allowedRoles.includes("admin");

  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useGetUserProfileQuery(userId || "", {
    skip: !shouldCheckProfile || !userId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!shouldCheckProfile) {
      setIsProfileCheckComplete(true);
      return;
    }

    if (profileLoading) return;

    // Profile check is complete
    setIsProfileCheckComplete(true);
  }, [profileLoading, shouldCheckProfile]);

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // If we're still checking the profile, show loading
  if (!isProfileCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your profile...</p>
        </div>
      </div>
    );
  }

  // For regular users, check if they have a profile
  if (shouldCheckProfile && !profileData && !profileError) {
    // User doesn't have a profile, redirect to profile completion
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
