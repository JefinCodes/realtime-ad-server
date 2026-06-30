const express = require("express");
const cors = require("cors");

const verifyJwt = require("./middlewares/verifyJwt");
const attachAdvertiser = require("./middlewares/attachAdvertiser");

const dashboardRoutes = require("./routes/dashboard");
const campaignRoutes = require("./routes/campaign");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Realtime Ad Server API"
    });
});

app.use(verifyJwt);
app.use(attachAdvertiser);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/campaign", campaignRoutes);

module.exports = app;
