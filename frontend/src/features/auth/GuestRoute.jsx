import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950 text-sm font-medium text-slate-400">
        Loading your workspace...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
