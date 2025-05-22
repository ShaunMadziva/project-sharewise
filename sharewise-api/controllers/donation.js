const Donation = require("../models/Donation");
const processedData = require("../helpers/dataProcessor.js");

const createDonation = async (req, res) => {
  try {
    const data = req.body;

    const newDonation = await Donation.createDonation(data);

    res.status(201).json({
      success: true,
      donation: newDonation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.getAll();
    res.status(200).json({
      success: true,
      donations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.getById(req.params.id);
    res.status(200).json({
      success: true,
      donation,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getDonationByDonorId = async (req, res) => {
  try {
    const donations = await Donation.getByDonorId(req.params.donorId);
    res.status(200).json({
      success: true,
      donations,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const processDonorData = async (req, res) => {
  try {
    const donorId = req.params.donorId;
    const donations = await Donation.getByDonorId(donorId);
    const processed = processedData.aggregateRequestsData(donations);

    res.status(200).json({
      success: true,
      processed,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      deletedDonation,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  deleteDonation,
  getDonationByDonorId,
  processDonorData,
};
