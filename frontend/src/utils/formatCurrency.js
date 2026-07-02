/**
 * Formats numbers into INR currency format.
 * Example: 1500 → ₹1,500
 */

export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return "₹0";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}
