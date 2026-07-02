import api from "./api";

/**
 * Fetch dashboard data.
 * Returns:
 * {
 *   advertiser: {...},
 *   campaigns: [...]
 * }
 */
export async function getDashboard() {
    const response = await api.get("/api/dashboard");
    return response.data;
}

/**
 * Update advertiser name.
 */
export async function updateAdvertiserName(name) {
    const response = await api.put("/api/advertiser/name", {
        name,
    });

    return response.data;
}

/**
 * Add money to advertiser wallet.
 * Amount is incremented by backend.
 */
export async function addWalletBalance(amount) {
    const response = await api.put("/api/advertiser/wallet", {
        amount,
    });

    return response.data;
}

/**
 * Delete advertiser account.
 */
export async function deleteAdvertiser() {
    const response = await api.delete("/api/advertiser");
    return response.data;
}
