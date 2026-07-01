const express = require("express");

const router = express.Router();

const advertiserController = require("../controllers/advertiser");

router.patch("/name", advertiserController.updateName);
router.patch("/wallet", advertiserController.addMoney);
router.delete("/", advertiserController.deleteAccount);

module.exports = router;
