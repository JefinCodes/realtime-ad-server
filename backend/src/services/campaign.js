const prisma = require("../config/prisma");

exports.createCampaign = async (advertiser, body) => {

    const {
        name,
        bid,
        budget,
        headline,
        description,
        imageUrl,
        startDate,
        endDate,
    } = body;

    if (
        !name ||
        bid === undefined ||
        budget === undefined ||
        !headline ||
        !description ||
        !imageUrl ||
        !startDate ||
        !endDate
    ) {
        throw new Error("All fields are required.");
    }

    if (Number(bid) <= 0) {
        throw new Error("Bid must be greater than 0.");
    }

    if (Number(budget) <= 0) {
        throw new Error("Budget must be greater than 0.");
    }

    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
        throw new Error("Start date must be today or later.");
    }
    if (end < start) {
        throw new Error("End date must be on or after start date.");
    }

    if (start.getTime() === today.getTime()) {
        start.setHours(
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds()
        );
    } else {
        start.setHours(0, 0, 0, 0);
    }
    end.setHours(23, 59, 59, 999);

    const result = await prisma.$transaction(async (tx) => {

        const latestAdvertiser = await tx.advertiser.findUnique({
            where: {
                id: advertiser.id,
            },
            select: {
                walletBalance: true,
            },
        });

        if (!latestAdvertiser) {
            throw new Error("Advertiser not found.");
        }

        if (Number(latestAdvertiser.walletBalance) < Number(budget)) {
            throw new Error("Insufficient wallet balance.");
        }

        await tx.advertiser.update({
            where: {
                id: advertiser.id,
            },
            data: {
                walletBalance: {
                    decrement: budget,
                },
            },
        });

        const campaign = await tx.campaign.create({
            data: {
                advertiserId: advertiser.id,
                name,
                bid,
                budget,
                remainingBudget: budget,
                status: "active",
                headline,
                description,
                imageUrl,
                startDate: start,
                endDate: end,
            },
        });

        return campaign;
    });

    return result;
};
