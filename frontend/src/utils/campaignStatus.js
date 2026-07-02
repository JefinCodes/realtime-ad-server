/**
 * Determines the display status of a campaign.
 *
 * Rules:
 *
 * 1. If current time > endDate
 *      => Ended
 *
 * 2. Else if backend status === "paused"
 *      => Paused
 *
 * 3. Else if backend status === "active"
 *      && current time < startDate
 *      => Scheduled
 *
 * 4. Else
 *      => Active
 */

export function getCampaignStatus(campaign) {
    const now = new Date();

    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (now > endDate) {
        return {
            label: "Ended",
            value: "ended",
            color:
                "bg-red-500/15 text-red-400 border border-red-500/30",
            canToggle: false,
        };
    }

    if (campaign.status === "paused") {
        return {
            label: "Paused",
            value: "paused",
            color:
                "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
            canToggle: true,
        };
    }

    if (
        campaign.status === "active" &&
        now < startDate
    ) {
        return {
            label: "Scheduled",
            value: "scheduled",
            color:
                "bg-blue-500/15 text-blue-400 border border-blue-500/30",
            canToggle: true,
        };
    }

    return {
        label: "Active",
        value: "active",
        color:
            "bg-green-500/15 text-green-400 border border-green-500/30",
        canToggle: true,
    };
}

/**
 * Returns the next status to send to the backend.
 *
 * active  -> paused
 * paused  -> active
 */
export function getNextCampaignStatus(currentStatus) {
    return currentStatus === "active"
        ? "paused"
        : "active";
}
