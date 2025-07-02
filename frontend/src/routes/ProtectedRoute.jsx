// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = () => {
//   const { user } = useAuth();

//   return user ? <Outlet /> : <Navigate to="/" />;
// };

// export default ProtectedRoute;


import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  // Check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" />; // or show unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
