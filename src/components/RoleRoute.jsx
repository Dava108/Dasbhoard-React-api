import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    // Si el JSON está corrupto → lo limpia y manda a login
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Validar rol
  if (user.rol !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;