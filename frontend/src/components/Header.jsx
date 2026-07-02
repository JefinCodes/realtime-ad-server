import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiLogOut, FiLayout } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const isHome = location.pathname === "/";
    const isDashboard = location.pathname === "/dashboard";

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link
                    to="/"
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105">
                        A
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-bold tracking-tight text-white">
                            AdServer
                        </span>

                        <span className="text-xs text-zinc-500">
                            Real-Time Advertising
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {!isDashboard && (
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/dashboard")}
                                    className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-indigo-500"
                                >
                                    <FiLayout />

                                    Dashboard
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                            >
                                <FiLogOut />

                                Logout
                            </motion.button>
                        </>
                    ) : (
                        !location.pathname.startsWith("/auth") && (
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/auth")}
                                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                            >
                                Login / Sign Up

                                <FiArrowRight />
                            </motion.button>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}
