import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

interface ProtectedRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      // If not authenticated, force a full page reload to the login page.
      window.location.href = "/login";
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || !isAuthenticated()) {
    // While loading or before the redirect happens, render a loading indicator.
    return <div>Loading...</div>; // Or a spinner component
  }

  if (roles && !hasRole(roles)) {
    // Authenticated but not authorized, redirect to the main dashboard page.
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the child components.
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
