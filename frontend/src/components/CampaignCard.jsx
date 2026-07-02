import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FiActivity,
    FiDollarSign,
    FiEye,
    FiMousePointer,
    FiPlay,
    FiPause,
    FiTrash2,
    FiCalendar,
} from "react-icons/fi";

import {
    getCampaignStatus,
    getNextCampaignStatus,
} from "../utils/campaignStatus";

export default function CampaignCard({
    campaign,
    loading = false,
    onToggleStatus,
    onDelete,
}) {
    const navigate = useNavigate();

    const status = getCampaignStatus(campaign);

    const nextStatus = getNextCampaignStatus(
        campaign.status
    );

    return (
        <motion.div
            whileHover={{
                y: -4,
            }}
            transition={{
                duration: 0.2,
            }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {campaign.name}
                    </h2>

                    <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                <Stat
                    icon={<FiDollarSign />}
                    label="Bid"
                    value={`₹${campaign.bid}`}
                />

                <Stat
                    icon={<FiDollarSign />}
                    label="Budget"
                    value={`₹${campaign.budget}`}
                />

                <Stat
                    icon={<FiDollarSign />}
                    label="Remaining"
                    value={`₹${campaign.remainingBudget}`}
                />

                <Stat
                    icon={<FiEye />}
                    label="Impressions"
                    value={campaign.impressions}
                />

                <Stat
                    icon={<FiMousePointer />}
                    label="Clicks"
                    value={campaign.clicks}
                />

                <Stat
                    icon={<FiActivity />}
                    label="CTR"
                    value={`${campaign.ctr}%`}
                />
            </div>

            {/* Dates */}
            <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                    <FiCalendar />

                    <span>
                        Start:{" "}
                        {new Date(
                            campaign.startDate
                        ).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <FiCalendar />

                    <span>
                        End:{" "}
                        {new Date(
                            campaign.endDate
                        ).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
                {status.canToggle && (
                    <button
                        disabled={loading}
                        onClick={() =>
                            onToggleStatus(
                                campaign.id,
                                nextStatus
                            )
                        }
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {nextStatus === "paused" ? (
                            <>
                                <FiPause />
                                Pause
                            </>
                        ) : (
                            <>
                                <FiPlay />
                                Resume
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={() =>
                        navigate(`/campaign/${campaign.id}`)
                    }
                    className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-indigo-500"
                >
                    <FiEye />
                    View
                </button>

                <button
                    disabled={loading}
                    onClick={() =>
                        onDelete(campaign.id)
                    }
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500 disabled:opacity-50"
                >
                    <FiTrash2 />
                    Delete
                </button>
            </div>
        </motion.div>
    );
}

function Stat({ icon, label, value }) {
    return (
        <div className="rounded-xl border border-white/5 bg-black/20 p-3">
            <div className="mb-2 text-zinc-500">
                {icon}
            </div>

            <p className="text-xs text-zinc-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-white">
                {value}
            </p>
        </div>
    );
}
