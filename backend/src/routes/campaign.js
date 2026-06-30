const express = require("express");

const router = express.Router();

const campaignController = require("../controllers/campaign");

router.post("/", campaignController.createCampaign);

module.exports = router;
