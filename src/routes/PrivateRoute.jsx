import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = () => {
  const { isAuth, isLoading } = useSelector((state) => state.userAuth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner/>
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;