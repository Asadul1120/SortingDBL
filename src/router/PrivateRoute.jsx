// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function PrivateRoute({ children }) {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
