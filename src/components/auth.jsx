import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/userContext";

export const RequireAuth = ({ auth }) => {
    const { loggedIn } = useAuth();
    const location = useLocation();

    return (
        (loggedIn && auth == true)
            ? <Outlet />
            : (loggedIn && auth == false)
                ? <Navigate to="/" state={{ from: location }} replace />
                : (!loggedIn && auth == false)
                    ? <Outlet />
                    : <Navigate to="/authentication/sign-in" state={{ from: location }} replace />

    );
}