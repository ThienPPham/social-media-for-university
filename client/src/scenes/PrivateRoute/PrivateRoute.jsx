import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, requiredRole }) => {
  const { user, token } = useSelector((state) => ({
    user: state.user,
    token: state.token,
  }));

  const isAuth = Boolean(token);
  const hasRequiredRole = user?.admin === requiredRole;

  if (!isAuth) {
    return <Navigate to="/home" />;
  }

  if (requiredRole !== undefined && !hasRequiredRole) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default PrivateRoute;
