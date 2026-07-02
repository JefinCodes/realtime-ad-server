import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function CampaignPlaceholder() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Campaign Details
                </h1>

                <p className="text-zinc-400">
                    This page will be implemented later.
                </p>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/auth"
                    element={<Auth />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/campaign/:id"
                    element={
                        <ProtectedRoute>
                            <CampaignPlaceholder />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </AuthProvider>
    );
}
