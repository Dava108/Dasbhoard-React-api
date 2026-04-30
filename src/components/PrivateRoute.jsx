import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  // Si NO hay usuario → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario → pasa
  return children;
};

export default PrivateRoute;