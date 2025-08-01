import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

interface ProtectedRouteProps {
  roles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
