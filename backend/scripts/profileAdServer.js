const { PrismaClient } = require("@prisma/client");
const { performance } = require("perf_hooks");

const Profiler = require("./profiler");
const printReport = require("./reportPrinter");

const prisma = new PrismaClient({
    log: [],
});


async function profileAdServe(deviceType = "desktop") {

    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`; // warmup

    const profiler = new Profiler();

    profiler.startTotal();

    // ------------------------------------------------------------
    // Measure Baseline DB Round Trip (SELECT 1)
    // ------------------------------------------------------------

    const baselineStart = performance.now();

    await prisma.$queryRaw`SELECT 1`;

    profiler.setBaseline(performance.now() - baselineStart);

    // ------------------------------------------------------------
    // Measure Transaction Acquisition
    // ------------------------------------------------------------

    let acquireTransactionTime = 0;

    const txStart = performance.now();

    await prisma.$transaction(async (tx) => {

        acquireTransactionTime = performance.now() - txStart;

        profiler.startTransaction();

        const now = new Date();

        // ========================================================
        // Fetch Campaigns
        // ========================================================

        const campaigns = await profiler.measure(
            "Fetch Active Campaigns",
            () =>
                tx.campaign.findMany({
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
                })
        );

        if (campaigns.length === 0) {
            throw new Error("No eligible campaigns found.");
        }

        // ========================================================
        // Weighted Random Selection
        // ========================================================

        const selectionStart = performance.now();

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

        profiler.addManual(
            "Weighted Random Selection",
            performance.now() - selectionStart
        );

        // ========================================================
        // Update Campaign
        // ========================================================

        await profiler.measure(
            "Update Remaining Budget",
            () =>
                tx.campaign.update({
                    where: {
                        id: selectedCampaign.id,
                    },
                    data: {
                        remainingBudget: {
                            decrement: selectedCampaign.bid,
                        },
                    },
                })
        );

        // ========================================================
        // Insert Impression
        // ========================================================

        await profiler.measure(
            "Insert Impression",
            () =>
                tx.impression.create({
                    data: {
                        campaignId: selectedCampaign.id,
                        deviceType,
                    },
                })
        );

        profiler.endTransaction();

    });

    // ------------------------------------------------------------
    // Commit Time Estimation
    // ------------------------------------------------------------

    const afterCommit = performance.now();

    profiler.endTotal();

    // ------------------------------------------------------------
    // Add Transaction Acquisition
    // ------------------------------------------------------------

    profiler.metrics.unshift({
        name: "Acquire Transaction",
        actual: acquireTransactionTime,
        baseline: profiler.getBaseline(),
        adjusted: Math.max(
            acquireTransactionTime - profiler.getBaseline(),
            0
        ),
    });

    // ------------------------------------------------------------
    // Estimate Commit Time
    // ------------------------------------------------------------

    const commitTime =
        profiler.getTotalTime() -
        profiler.getTransactionBodyTime() -
        acquireTransactionTime;

    profiler.metrics.push({
        name: "Commit Transaction",
        actual: commitTime,
        baseline: profiler.getBaseline(),
        adjusted: Math.max(
            commitTime - profiler.getBaseline(),
            0
        ),
    });

    printReport(profiler);

    await prisma.$disconnect();

}

profileAdServe("desktop")
    .catch(async (err) => {

        console.error(err);

        await prisma.$disconnect();

    });
