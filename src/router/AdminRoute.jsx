// AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function AdminRoute({ children }) {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  if (auth?.user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;
