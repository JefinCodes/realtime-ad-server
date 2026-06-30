const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/campaign");

router.post("/", campaignController.createCampaign);
router.patch("/:id/status", campaignController.changeCampaignStatus);
router.delete("/:id", campaignController.removeCampaign);

module.exports = router;
