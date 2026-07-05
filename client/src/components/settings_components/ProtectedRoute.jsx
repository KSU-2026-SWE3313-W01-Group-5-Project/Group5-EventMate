import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}