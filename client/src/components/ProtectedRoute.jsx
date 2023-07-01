import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ admin, children }) => {
  const { user } = useSelector((store) => store.auth);
  if (!user) {
    return <Navigate to="/" />;
  }
  if (admin && !user.admin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
export default ProtectedRoute;
