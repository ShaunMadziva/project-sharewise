const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

const donationRouter = require("./routes/donations");
const userRouter = require("./routes/user_routers");
const requestRouter = require("./routes/requests");
const fullfillDonationRouter = require("./routes/notifications")

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/donations", donationRouter);
app.use("/users", userRouter);
app.use("/requests", requestRouter);
app.use("/fulfill-donation", fullfillDonationRouter)

app.get("/", (req, res) => {
  res.status(200).json({
    title: "ShareWise",
    description: "Sharing is Caring",
  });
});

module.exports = app;
