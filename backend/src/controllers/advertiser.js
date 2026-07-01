const advertiserService = require("../services/advertiser");

exports.updateName = async (req, res) => {
    try {
        const advertiser = await advertiserService.updateName(
            req.advertiser.id,
            req.body.name
        );

        res.status(200).json(advertiser);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

exports.addMoney = async (req, res) => {
    try {
        const advertiser = await advertiserService.addMoney(
            req.advertiser.id,
            req.body.amount
        );

        res.status(200).json(advertiser);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await advertiserService.deleteAccount(req.advertiser);

        res.status(200).json({
            message: "Account deleted successfully.",
        });
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};
