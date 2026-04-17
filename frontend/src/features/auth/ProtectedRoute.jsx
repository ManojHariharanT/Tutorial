import { useAuth } from "../../hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950 text-sm font-medium text-slate-400">
        Loading your workspace...
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
