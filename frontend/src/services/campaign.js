import api from "./api";

/**
 * Create a new campaign.
 *
 * Payload:
 * {
 *   name,
 *   bid,
 *   budget,
 *   headline,
 *   description,
 *   imageUrl,
 *   startDate,
 *   endDate
 * }
 */
export async function createCampaign(campaignData) {
    const response = await api.post("/api/campaign", campaignData);
    return response.data;
}

/**
 * Update campaign status.
 *
 * status:
 * "active"
 * "paused"
 */
export async function updateCampaignStatus(id, status) {
    const response = await api.put(
        `/api/campaign/${id}/status`,
        {
            status,
        }
    );

    return response.data;
}

/**
 * Delete campaign.
 */
export async function deleteCampaign(id) {
    const response = await api.delete(
        `/api/campaign/${id}`
    );

    return response.data;
}
