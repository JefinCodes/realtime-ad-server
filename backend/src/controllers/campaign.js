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
