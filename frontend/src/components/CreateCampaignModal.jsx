import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiX,
    FiUpload,
    FiImage,
    FiDollarSign,
    FiCalendar,
    FiFileText,
    FiType,
} from "react-icons/fi";

import { uploadImage } from "../services/upload";

export default function CreateCampaignModal({
    open,
    onClose,
    onSubmit,
}) {
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [bid, setBid] = useState("");
    const [budget, setBudget] = useState("");

    const [headline, setHeadline] = useState("");
    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (!image) {
            setPreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [image]);

    useEffect(() => {
        if (!open) {
            setLoading(false);

            setName("");
            setBid("");
            setBudget("");

            setHeadline("");
            setDescription("");

            setStartDate("");
            setEndDate("");

            setImage(null);
            setPreview("");
        }
    }, [open]);

    const validate = () => {
        if (
            !name.trim() ||
            !bid ||
            !budget ||
            !headline.trim() ||
            !description.trim() ||
            !startDate ||
            !endDate
        ) {
            toast.error("Please fill all required fields.");
            return false;
        }

        if (!image) {
            toast.error("Please upload a campaign image.");
            return false;
        }

        if (Number(bid) <= 0) {
            toast.error("Bid must be greater than zero.");
            return false;
        }

        if (Number(budget) <= 0) {
            toast.error("Budget must be greater than zero.");
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End date must be after start date.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            toast.loading("Uploading image...", {
                id: "upload",
            });

            const imageUrl = await uploadImage(image);

            toast.success("Image uploaded", {
                id: "upload",
            });

            await onSubmit({
                name,
                bid: Number(bid),
                budget: Number(budget),
                headline,
                description,
                imageUrl,
                startDate,
                endDate,
            });

            setLoading(false);

            onClose();
        } catch (err) {
            console.error(err);

            setLoading(false);

            toast.error(
                err?.message || "Failed to create campaign."
            );
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="fixed left-1/2 top-1/2 z-[60] w-[95%] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl"
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Create Campaign
                                </h2>

                                <p className="mt-1 text-sm text-zinc-400">
                                    Launch a new advertisement campaign.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 transition hover:bg-zinc-800"
                            >
                                <FiX
                                    size={22}
                                    className="text-zinc-400"
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="max-h-[80vh] overflow-y-auto px-8 py-8"
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                            
                                {/* Campaign Name */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <FiType />
                                        Campaign Name
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Summer Sale 2026"
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    />
                                </div>

                                {/* Bid */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <FiDollarSign />
                                        Bid Per Click
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={bid}
                                        onChange={(e) =>
                                            setBid(e.target.value)
                                        }
                                        placeholder="5"
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    />

                                    <p className="mt-2 text-xs text-zinc-500">
                                        Amount deducted for every valid ad click.
                                    </p>
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <FiDollarSign />
                                        Campaign Budget
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={budget}
                                        onChange={(e) =>
                                            setBudget(e.target.value)
                                        }
                                        placeholder="1000"
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <FiCalendar />
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <FiCalendar />
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                    />
                                </div>

                                <div />
                            </div>

                            {/* Headline */}

                            <div className="mt-8">
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <FiType />
                                    Advertisement Headline
                                </label>

                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) =>
                                        setHeadline(e.target.value)
                                    }
                                    placeholder="This headline will be shown to users viewing your advertisement."
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />

                                <p className="mt-2 text-xs text-zinc-500">
                                    This is the title users will see in your advertisement.
                                </p>
                            </div>

                            {/* Description */}

                            <div className="mt-6">
                                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <FiFileText />
                                    Advertisement Description
                                </label>

                                <textarea
                                    rows={5}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Describe your product or service. This content will be visible to users."
                                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />

                                <p className="mt-2 text-xs text-zinc-500">
                                    Write an engaging description that encourages users to click your advertisement.
                                </p>
                            </div>

                            {/* Image Upload */}

                            <div className="mt-8">
                                <label className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-300">
                                    <FiImage />
                                    Advertisement Image
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900 p-8 transition hover:border-indigo-500">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-64 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <>
                                            <FiUpload
                                                size={36}
                                                className="mb-4 text-indigo-400"
                                            />

                                            <p className="text-center font-medium text-white">
                                                Click to upload campaign image
                                            </p>

                                            <p className="mt-2 text-sm text-zinc-500">
                                                PNG, JPG or WEBP
                                            </p>
                                        </>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            setImage(
                                                e.target.files?.[0] ?? null
                                            )
                                        }
                                    />
                                </label>

                                <p className="mt-3 text-xs text-zinc-500">
                                    This image will be uploaded to Cloudinary
                                    and displayed to users when your
                                    advertisement is served.
                                </p>
                            </div>
                            {/* Footer */}

                            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-medium text-white transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating Campaign..."
                                        : "Create Campaign"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
