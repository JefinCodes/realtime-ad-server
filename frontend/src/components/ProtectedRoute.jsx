import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                    <div className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-white animate-spin" />

                    <p className="text-zinc-400 text-sm">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/auth"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}
