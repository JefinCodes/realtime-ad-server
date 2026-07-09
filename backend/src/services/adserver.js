const prisma = require("../config/prisma");

exports.serveAd = async (deviceType) => {
    return prisma.$transaction(async (tx) => {

        const now = new Date();

        const campaigns = await tx.campaign.findMany({
            where: {
                status: "active",

                startDate: {
                    lte: now,
                },

                endDate: {
                    gte: now,
                },

                remainingBudget: {
                    gt: 0,
                },
            },
        });

        if (campaigns.length === 0) {
            throw new Error("No eligible campaigns");
        }

        const totalWeight = campaigns.reduce(
            (sum, campaign) => sum + Number(campaign.bid),
            0
        );

        let random = Math.random() * totalWeight;

        let selectedCampaign = campaigns[0];

        for (const campaign of campaigns) {
            random -= Number(campaign.bid);

            if (random <= 0) {
                selectedCampaign = campaign;
                break;
            }
        }

        await tx.campaign.update({
            where: {
                id: selectedCampaign.id,
            },
            data: {
                remainingBudget: {
                    decrement: selectedCampaign.bid,
                },
            },
        });

        const impression = await tx.impression.create({
            data: {
                campaignId: selectedCampaign.id,
                deviceType,
            },
        });

        return {
            impressionId: impression.id,
            headline: selectedCampaign.headline,
            description: selectedCampaign.description,
            imageUrl: selectedCampaign.imageUrl,
        };
    });
};

exports.registerClick = async (impressionId) => {

    const impression = await prisma.impression.findUnique({
        where: {
            id: impressionId,
        },
        include: {
            click: true,
        },
    });

    if (!impression) {
        throw new Error("Impression not found");
    }

    if (impression.click) {
        throw new Error("Click already registered");
    }

    await prisma.click.create({
        data: {
            impressionId,
        },
    });

    return {
        success: true,
        message: "Click recorded successfully",
    };
};
