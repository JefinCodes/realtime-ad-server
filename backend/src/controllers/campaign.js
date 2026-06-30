const campaignService = require("../services/campaign");

exports.createCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.createCampaign(
            req.advertiser,
            req.body
        );

        return res.status(201).json(campaign);

    } catch (err) {

        return res.status(400).json({
            message: err.message
        });

    }
};

exports.changeCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const campaign = await campaignService.updateCampaignStatus(id, status);

        res.status(200).json({
            message: "Campaign status updated successfully.",
            campaign,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

exports.removeCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        await campaignService.deleteCampaign(id);

        res.status(200).json({
            message: "Campaign deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
