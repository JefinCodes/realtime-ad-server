const adServerService = require("../services/adserver");

exports.serveAd = async (req, res) => {
    try {
        const { deviceType } = req.body;

        if (!deviceType) {
            return res.status(400).json({
                message: "deviceType is required",
            });
        }

        if (!["mobile", "desktop"].includes(deviceType)) {
            return res.status(400).json({
                message: "deviceType must be mobile or desktop",
            });
        }

        const ad = await adServerService.serveAd(deviceType);

        res.json(ad);
    } catch (err) {
        console.error(err);

        if (err.message === "No eligible campaigns") {
            return res.status(404).json({
                message: err.message,
            });
        }

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

exports.registerClick = async (req, res) => {
    try {
        const { impressionId } = req.body;

        if (!impressionId) {
            return res.status(400).json({
                message: "impressionId is required",
            });
        }

        const response = await adServerService.registerClick(
            impressionId
        );

        res.json(response);
    } catch (err) {
        console.error(err);

        if (err.message === "Impression not found") {
            return res.status(404).json({
                message: err.message,
            });
        }

        if (err.message === "Click already registered") {
            return res.status(409).json({
                message: err.message,
            });
        }

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
