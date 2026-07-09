const express = require("express");
const cors = require("cors");

const verifyJwt = require("./middlewares/verifyJwt");
const attachAdvertiser = require("./middlewares/attachAdvertiser");

const dashboardRoutes = require("./routes/dashboard");
const advertiserRoutes = require("./routes/advertiser");
const campaignRoutes = require("./routes/campaign");
const adServerRoutes = require("./routes/adserver");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Realtime Ad Server API"
    });
});

app.use("/api/adserver", adServerRoutes);

app.use(verifyJwt);
app.use(attachAdvertiser);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/advertiser", advertiserRoutes);
app.use("/api/campaign", campaignRoutes);

module.exports = app;
