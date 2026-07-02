/**
 * Formats ISO date strings into readable format.
 * Example: 2026-07-01 → 1 Jul 2026
 */

export function formatDate(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}
