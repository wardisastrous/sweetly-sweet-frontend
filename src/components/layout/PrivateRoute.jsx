import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({
  children,
  adminOnly = false,
}) {
  const { isAuthenticated, user } = useSelector(
    (s) => s.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}