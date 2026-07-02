import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus,
    FiDollarSign,
    FiUser,
    FiTrash2,
} from "react-icons/fi";

import Header from "../components/Header";
import CampaignCard from "../components/CampaignCard";
import CreateCampaignModal from "../components/CreateCampaignModal";

import {
    getDashboard,
    updateAdvertiserName,
    addWalletBalance,
    deleteAdvertiser,
} from "../services/advertiser";

import {
    createCampaign,
    updateCampaignStatus,
    deleteCampaign,
} from "../services/campaign";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { logout } = useAuth();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    const [createOpen, setCreateOpen] = useState(false);

    const [name, setName] = useState("");

    const [walletAmount, setWalletAmount] =
        useState("");

    async function loadDashboard() {
        try {
            setLoading(true);

            const data = await getDashboard();

            setDashboard(data);

            setName(data.advertiser.name);
        } catch (err) {
            console.error(err);

            toast.error(
                "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);
    
    async function handleCreateCampaign(
        campaignData
    ) {
        try {
            await createCampaign(campaignData);

            toast.success(
                "Campaign created successfully."
            );

            setCreateOpen(false);

            await loadDashboard();
        } catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ??
                    "Unable to create campaign."
            );
        }
    }

    async function handleToggleStatus(
        id,
        status
    ) {
        try {
            await updateCampaignStatus(
                id,
                status
            );

            toast.success(
                "Campaign updated."
            );

            await loadDashboard();
        } catch (err) {
            toast.error(
                "Unable to update campaign."
            );
        }
    }

    async function handleDeleteCampaign(id) {
        if (
            !window.confirm(
                "Delete this campaign?"
            )
        )
            return;

        try {
            await deleteCampaign(id);

            toast.success(
                "Campaign deleted."
            );

            await loadDashboard();
        } catch (err) {
            toast.error(
                "Unable to delete campaign."
            );
        }
    }
    
    async function handleUpdateName(e) {
        e.preventDefault();

        try {
            await updateAdvertiserName(name);

            toast.success("Name updated.");

            await loadDashboard();
        } catch (err) {
            toast.error(
                "Unable to update name."
            );
        }
    }

    async function handleWallet(e) {
        e.preventDefault();

        try {
            await addWalletBalance(
                Number(walletAmount)
            );

            toast.success(
                "Wallet updated."
            );

            setWalletAmount("");

            await loadDashboard();
        } catch (err) {
            toast.error(
                "Unable to update wallet."
            );
        }
    }

    async function handleDeleteAccount() {
        if (
            !window.confirm(
                "Delete your account permanently?"
            )
        )
            return;

        try {
            await deleteAdvertiser();

            toast.success(
                "Account deleted."
            );

            await logout();
        } catch (err) {
            toast.error(
                "Unable to delete account."
            );
        }
    }
        
    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b]">
                <Header />

                <div className="flex h-[80vh] items-center justify-center">
                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-zinc-700 border-t-white" />
                </div>
            </div>
        );
    }

    const advertiser =
        dashboard.advertiser;

    const campaigns =
        dashboard.campaigns;
        
    return (
        <div className="min-h-screen bg-[#09090b] text-white">
            <Header />

            <CreateCampaignModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreateCampaign}
            />

            <main className="mx-auto max-w-7xl px-6 py-10">
                {/* Greeting */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-bold tracking-tight">
                        Hey, {advertiser.name} 👋
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Welcome back. Here's an overview of your advertising
                        performance.
                    </p>
                </motion.div>

                {/* Top Summary */}

                <div className="mb-10 grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-green-500/20 p-3">
                                <FiDollarSign
                                    className="text-green-400"
                                    size={24}
                                />
                            </div>

                            <div>
                                <p className="text-sm text-zinc-400">
                                    Wallet Balance
                                </p>

                                <h2 className="mt-1 text-3xl font-bold">
                                    ₹
                                    {Number(
                                        advertiser.walletBalance
                                    ).toLocaleString()}
                                </h2>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-500/20 p-3">
                                <FiUser
                                    className="text-indigo-400"
                                    size={24}
                                />
                            </div>

                            <div>
                                <p className="text-sm text-zinc-400">
                                    Registered Email
                                </p>

                                <h2 className="mt-1 break-all text-lg font-semibold">
                                    {advertiser.email}
                                </h2>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 to-cyan-600 p-7"
                    >
                        <div className="flex h-full flex-col justify-between">
                            <div>
                                <p className="text-sm text-indigo-100">
                                    Campaigns
                                </p>

                                <h2 className="mt-2 text-4xl font-bold">
                                    {campaigns.length}
                                </h2>
                            </div>

                            <button
                                onClick={() => setCreateOpen(true)}
                                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-100"
                            >
                                <FiPlus />

                                Create Campaign
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Main Layout */}

                <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
                
                    {/* Left Section */}

                    <section>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Your Campaigns
                                </h2>

                                <p className="mt-1 text-sm text-zinc-400">
                                    Manage campaign status, monitor
                                    performance, and create new campaigns.
                                </p>
                            </div>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-700 bg-white/5 p-10 text-center">
                                <div className="mb-6 rounded-full bg-indigo-500/10 p-5">
                                    <FiPlus
                                        className="text-indigo-400"
                                        size={34}
                                    />
                                </div>

                                <h3 className="text-2xl font-semibold">
                                    No Campaigns Yet
                                </h3>

                                <p className="mt-3 max-w-md text-zinc-400">
                                    Start your advertising journey by creating
                                    your first campaign. You can manage its
                                    status, monitor impressions, clicks, CTR,
                                    and budget directly from this dashboard.
                                </p>

                                <button
                                    onClick={() => setCreateOpen(true)}
                                    className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 font-semibold transition hover:opacity-90"
                                >
                                    <FiPlus />

                                    Create Campaign
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 xl:grid-cols-2">
                                {campaigns.map((campaign) => (
                                    <CampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        onToggleStatus={
                                            handleToggleStatus
                                        }
                                        onDelete={
                                            handleDeleteCampaign
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                    
                    {/* Right Sidebar */}

                    <aside className="space-y-6">
                        {/* Update Name */}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                        >
                            <h3 className="mb-5 text-xl font-semibold">
                                Update Name
                            </h3>

                            <form
                                onSubmit={handleUpdateName}
                                className="space-y-4"
                            >
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Advertiser Name"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-indigo-500"
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500"
                                >
                                    Update Name
                                </button>
                            </form>
                        </motion.div>

                        {/* Wallet */}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                        >
                            <h3 className="mb-5 text-xl font-semibold">
                                Add Wallet Balance
                            </h3>

                            <form
                                onSubmit={handleWallet}
                                className="space-y-4"
                            >
                                <input
                                    type="number"
                                    min="1"
                                    value={walletAmount}
                                    onChange={(e) =>
                                        setWalletAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Amount"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none transition focus:border-indigo-500"
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-green-600 py-3 font-semibold transition hover:bg-green-500"
                                >
                                    Add Balance
                                </button>
                            </form>
                        </motion.div>

                        {/* Account */}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-red-500/10 p-3">
                                    <FiTrash2
                                        className="text-red-400"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Delete Account
                                    </h3>

                                    <p className="mt-1 text-sm text-zinc-400">
                                        Permanently delete your advertiser
                                        account. This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleDeleteAccount}
                                className="mt-6 w-full rounded-xl bg-red-600 py-3 font-semibold transition hover:bg-red-500"
                            >
                                Delete Account
                            </button>
                        </motion.div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
