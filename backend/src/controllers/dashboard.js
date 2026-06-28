const dashboardService = require("../services/dashboard");

exports.getDashboard = async (req, res) => {
    try {
        const dashboard = await dashboardService.getDashboard(req.advertiser);

        return res.status(200).json(dashboard);
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message,
        });
    }
};
