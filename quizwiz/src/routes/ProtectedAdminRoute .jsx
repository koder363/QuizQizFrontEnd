// components/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role !== "ROLE_ADMIN") {
    // here replace is going to replace the 1 page from where ever the user is comming from and place the current page in the browser routing stack
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedAdminRoute;
