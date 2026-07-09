const { performance } = require("perf_hooks");

class Profiler {
    constructor() {
        this.metrics = [];
        this.baseline = 0;
        this.transactionStart = 0;
        this.transactionEnd = 0;
        this.totalStart = 0;
        this.totalEnd = 0;
    }

    startTotal() {
        this.totalStart = performance.now();
    }

    endTotal() {
        this.totalEnd = performance.now();
    }

    startTransaction() {
        this.transactionStart = performance.now();
    }

    endTransaction() {
        this.transactionEnd = performance.now();
    }

    setBaseline(ms) {
        this.baseline = ms;
    }

    getBaseline() {
        return this.baseline;
    }

    async measure(name, fn, subtractBaseline = true) {
        const start = performance.now();

        const result = await fn();

        const end = performance.now();

        const actual = end - start;

        this.metrics.push({
            name,
            actual,
            baseline: subtractBaseline ? this.baseline : 0,
            adjusted: subtractBaseline
                ? Math.max(actual - this.baseline, 0)
                : actual,
        });

        return result;
    }

    addManual(name, duration) {
        this.metrics.push({
            name,
            actual: duration,
            baseline: 0,
            adjusted: duration,
        });
    }

    getMetrics() {
        return this.metrics;
    }

    getTotalTime() {
        return this.totalEnd - this.totalStart;
    }

    getTransactionBodyTime() {
        return this.transactionEnd - this.transactionStart;
    }

    getMeasuredOperationTime() {
        return this.metrics.reduce(
            (sum, metric) => sum + metric.actual,
            0
        );
    }

    getTransactionOverhead() {
        return Math.max(
            this.getTransactionBodyTime() -
                this.getMeasuredOperationTime(),
            0
        );
    }

    getPercent(actual) {
        return (
            (actual / this.getTotalTime()) *
            100
        ).toFixed(2);
    }
}

module.exports = Profiler;
