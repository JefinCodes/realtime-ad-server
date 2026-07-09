const Table = require("cli-table3");
const chalk = require("chalk").default;

function progressBar(percent) {
    const width = 30;

    const filled = Math.round((percent / 100) * width);

    return (
        "█".repeat(filled) +
        "░".repeat(width - filled)
    );
}

function printSection(title) {
    console.log(
        chalk.cyan(
            "\n────────────────────────────────────────────────────────────────────"
        )
    );

    console.log(chalk.bold.cyan(title));

    console.log(
        chalk.cyan(
            "────────────────────────────────────────────────────────────────────"
        )
    );
}

function printReport(profiler) {

    const metrics = profiler.getMetrics();

    const totalRequest = profiler.getTotalTime();

    const transactionBody = profiler.getTransactionBodyTime();

    const transactionOverhead = profiler.getTransactionOverhead();

    console.clear();

    console.log(
        chalk.bold.green(
            "\n══════════════════════════════════════════════════════════════════════"
        )
    );

    console.log(
        chalk.bold.green(
            "                REAL-TIME AD SERVER PERFORMANCE PROFILE"
        )
    );

    console.log(
        chalk.bold.green(
            "══════════════════════════════════════════════════════════════════════"
        )
    );

    console.log();

    console.log(
        chalk.white(
            `Generated At          : ${new Date().toLocaleString()}`
        )
    );

    console.log(
        chalk.white(
            `Database              : Neon PostgreSQL`
        )
    );

    console.log(
        chalk.white(
            `Benchmark Type        : Single Request`
        )
    );

    printSection("BASELINE DATABASE ROUND TRIP");

    console.log(
        chalk.yellow(
            `SELECT 1 Round Trip : ${profiler
                .getBaseline()
                .toFixed(2)} ms`
        )
    );

    console.log();

    console.log(chalk.gray("Includes:"));

    console.log("  ✓ Client → Neon network latency");

    console.log("  ✓ TLS encryption/decryption");

    console.log("  ✓ Neon proxy routing");

    console.log("  ✓ PostgreSQL parsing");

    console.log("  ✓ PostgreSQL execution");

    console.log("  ✓ Result transfer");

    console.log("  ✓ Prisma serialization/deserialization");

    console.log();

    console.log(
        chalk.gray(
            "Used as the baseline for estimating database processing time."
        )
    );

    printSection("PIPELINE BREAKDOWN");

    const table = new Table({
        head: [
            chalk.cyan("Step"),
            chalk.cyan("Actual"),
            chalk.cyan("Baseline"),
            chalk.cyan("Estimated Processing"),
            chalk.cyan("% Total"),
        ],
    });

    metrics.forEach((m) => {

        table.push([
            m.name,
            `${m.actual.toFixed(2)} ms`,
            m.baseline === 0
                ? "-"
                : `${m.baseline.toFixed(2)} ms`,
            `${m.adjusted.toFixed(2)} ms`,
            `${profiler.getPercent(m.actual)} %`,
        ]);

    });

    console.log(table.toString());

    printSection("TRANSACTION SUMMARY");

    const summary = new Table({
        colWidths: [35, 18],
    });

    summary.push(
        [
            "Transaction Body",
            `${transactionBody.toFixed(2)} ms`,
        ],
        [
            "Measured Operations",
            `${profiler
                .getMeasuredOperationTime()
                .toFixed(2)} ms`,
        ],
        [
            "Transaction Overhead",
            `${transactionOverhead.toFixed(2)} ms`,
        ],
        [
            "Total Request",
            `${totalRequest.toFixed(2)} ms`,
        ]
    );

    console.log(summary.toString());

    console.log();

    console.log(chalk.gray("Transaction Overhead includes:"));

    console.log("  ✓ Prisma transaction management");

    console.log("  ✓ Await / Promise scheduling");

    console.log("  ✓ JavaScript execution");

    console.log("  ✓ Event loop scheduling");

    console.log("  ✓ Internal transaction bookkeeping");

    console.log("  ✓ Miscellaneous client-side processing");

    console.log();

    console.log(chalk.gray("Transaction Overhead excludes:"));

    console.log("  ✗ SQL execution");

    console.log("  ✗ Weighted random selection");

    console.log("  ✗ Database commit");

    printSection("CONTRIBUTION TO TOTAL REQUEST");

    metrics.forEach((m) => {

        const pct =
            (m.actual / totalRequest) * 100;

        console.log(
            `${m.name.padEnd(30)} ${progressBar(
                pct
            )} ${pct.toFixed(2)}%`
        );

    });

    console.log();

    console.log(
        `${"Transaction Overhead".padEnd(
            30
        )} ${progressBar(
            (transactionOverhead /
                totalRequest) *
                100
        )} ${(
            (transactionOverhead /
                totalRequest) *
            100
        ).toFixed(2)}%`
    );

    console.log();

    console.log(
        chalk.bold.green(
            "══════════════════════════════════════════════════════════════════════"
        )
    );

    console.log(
        chalk.bold.green(
            `Total Request Time : ${totalRequest.toFixed(
                2
            )} ms`
        )
    );

    console.log(
        chalk.bold.green(
            "══════════════════════════════════════════════════════════════════════\n"
        )
    );
}

module.exports = printReport;
