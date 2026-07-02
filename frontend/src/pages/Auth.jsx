import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiLogIn,
    FiUserPlus,
} from "react-icons/fi";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
    const navigate = useNavigate();

    const {
        login,
        signup,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();

    const [tab, setTab] = useState("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            return;
        }

        setLoading(true);

        let result;

        if (tab === "login") {
            result = await login(email, password);
        } else {
            result = await signup(email, password);
        }

        setLoading(false);

        if (result.success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Header />

            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-24 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />
                <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
            </div>

            <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                    <h1 className="mb-8 text-center text-3xl font-bold">
                        Welcome
                    </h1>

                    {/* Tabs */}
                    <div className="mb-8 flex rounded-xl bg-zinc-900 p-1">
                        <button
                            onClick={() => setTab("login")}
                            className={`flex-1 rounded-lg py-3 transition ${
                                tab === "login"
                                    ? "bg-indigo-600 text-white"
                                    : "text-zinc-400"
                            }`}
                        >
                            Login
                        </button>

                        <button
                            onClick={() => setTab("signup")}
                            className={`flex-1 rounded-lg py-3 transition ${
                                tab === "signup"
                                    ? "bg-indigo-600 text-white"
                                    : "text-zinc-400"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={tab}
                            initial={{ opacity: 0, x: 25 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -25 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm text-zinc-400">
                                    Email
                                </label>

                                <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 px-4">
                                    <FiMail className="text-zinc-500" />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter email"
                                        className="w-full bg-transparent px-3 py-4 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-zinc-400">
                                    Password
                                </label>

                                <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 px-4">
                                    <FiLock className="text-zinc-500" />

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        className="w-full bg-transparent px-3 py-4 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    "Please wait..."
                                ) : tab === "login" ? (
                                    <>
                                        <FiLogIn />
                                        Login
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus />
                                        Create Account
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
