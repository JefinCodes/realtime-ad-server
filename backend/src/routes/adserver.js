const express = require("express");

const router = express.Router();

const adServerController = require("../controllers/adserver");

router.post("/serve", adServerController.serveAd);
router.post("/click", adServerController.registerClick);

module.exports = router;
