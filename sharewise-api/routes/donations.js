const { Router } = require("express");
const donationController = require("../controllers/donation");

const donationRouter = Router();

donationRouter.post("/", donationController.createDonation);
donationRouter.get("/", donationController.getAllDonations);
donationRouter.get("/donor/:donorId", donationController.getDonationByDonorId);
donationRouter.get("/:id", donationController.getDonationById);
donationRouter.delete("/:id", donationController.deleteDonation);

module.exports = donationRouter;
