const prisma = require("../config/prisma");

exports.getDashboard = async (advertiser) => {

    const campaigns = await prisma.campaign.findMany({
        where: {
            advertiserId: advertiser.id,
        },

        include: {
            impressions: {
                include: {
                    click: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    const campaignData = campaigns.map((campaign) => {

        const impressions = campaign.impressions.length;

        const clicks = campaign.impressions.filter(
            (impression) => impression.click !== null
        ).length;

        const ctr =
            impressions === 0
                ? 0
                : Number(((clicks / impressions) * 100).toFixed(2));

        return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            bid: campaign.bid,
            budget: campaign.budget,
            remainingBudget: campaign.remainingBudget,
            impressions,
            clicks,
            ctr,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
        };
    });

    return {
        advertiser: {
            id: advertiser.id,
            name: advertiser.name,
            email: advertiser.email,
            walletBalance: advertiser.walletBalance,
        },

        campaigns: campaignData,
    };
};
