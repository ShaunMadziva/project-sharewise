const Request = require("../models/Request");
const processedData = require("../helpers/dataProcessor.js");

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.getAll();
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const request = await Request.getById(id);
    res.status(200).json({ success: true, request });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

async function getRequestsBySchoolId(req, res) {
  const schoolId = parseInt(req.params.schoolId);
  try {
    const requests = await Request.getBySchoolId(schoolId);
    res.status(200).json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const processSchoolData = async (req, res) => {
  try {
    const schoolId = req.params.schoolId;
    const requests = await Request.getBySchoolId(schoolId);
    const processed = await processedData.aggregateRequestsData(requests);
    res.status(200).json({ success: true, processed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createNewRequest = async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const data = req.body;
    const newRequest = await Request.createRequest(schoolId, data);
    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await Request.deleteById(id);
    res.status(200).json({ success: true, deleted });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const updated = await Request.updateStatus(id, status);
    res.status(200).json({ success: true, updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllRequests,
  getRequestById,
  getRequestsBySchoolId,
  createNewRequest,
  deleteRequest,
  updateRequestStatus,
  processSchoolData,
};
