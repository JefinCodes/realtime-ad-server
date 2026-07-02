import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FiArrowRight,
    FiActivity,
    FiGlobe,
    FiZap,
} from "react-icons/fi";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleDashboard = () => {
        navigate(isAuthenticated ? "/dashboard" : "/auth");
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white overflow-hidden">
            <Header />

            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-24 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
                <div className="absolute -left-32 bottom-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            <main className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl"
                >
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                        <FiZap />
                        Lightning Fast Real-Time Ad Serving
                    </div>

                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
                        Reach Millions
                        <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Instantly.
                        </span>
                    </h1>

                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
                        Launch campaigns in seconds, optimize performance
                        in real time, and deliver advertisements globally
                        with an ultra-fast, scalable ad serving platform
                        built for modern businesses.
                    </p>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDashboard}
                            className="flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-semibold text-black shadow-lg transition hover:bg-zinc-200"
                        >
                            Go To Dashboard
                            <FiArrowRight />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/auth")}
                            className="rounded-xl border border-zinc-700 bg-zinc-900 px-7 py-3 font-semibold transition hover:border-indigo-500"
                        >
                            Get Started
                        </motion.button>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-24 grid w-full gap-6 md:grid-cols-3"
                >
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                        <FiActivity className="mb-4 text-3xl text-indigo-400" />

                        <h3 className="mb-3 text-xl font-semibold">
                            Real-Time Analytics
                        </h3>

                        <p className="text-sm leading-7 text-zinc-400">
                            Monitor impressions, clicks, CTR, campaign
                            budgets and remaining balances with instant
                            updates from your dashboard.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                        <FiGlobe className="mb-4 text-3xl text-cyan-400" />

                        <h3 className="mb-3 text-xl font-semibold">
                            Global Delivery
                        </h3>

                        <p className="text-sm leading-7 text-zinc-400">
                            Serve advertisements across the globe with
                            optimized routing and scalable infrastructure.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
                        <FiZap className="mb-4 text-3xl text-purple-400" />

                        <h3 className="mb-3 text-xl font-semibold">
                            High Performance
                        </h3>

                        <p className="text-sm leading-7 text-zinc-400">
                            Built for low latency and high throughput so
                            every ad reaches users in milliseconds.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
