import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.auth);
  const location = useLocation();
  
  if (!authChecked) {
    return <div className="text-center mt-20">Checking authentication...</div>;
  }

  return isAuthenticated && authChecked ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;