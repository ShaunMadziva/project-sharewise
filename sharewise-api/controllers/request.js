const { Request } = require("../models/Request")

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.getAll()
    res.status(200).json({ success: true, requests })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getRequestById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const request = await Request.getById(id)
    res.status(200).json({ success: true, request })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const createNewRequest = async (req, res) => {
  try {
    const schoolId = req.user.schoolId
    const data = req.body
    const newRequest = await Request.createRequest(schoolId, data)
    res.status(201).json({ success: true, request: newRequest })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const deleteRequest = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const deleted = await Request.deleteById(id)
    res.status(200).json({ success: true, deleted })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const updateRequestStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body
    const updated = await Request.updateStatus(id, status)
    res.status(200).json({ success: true, updated })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports = {
  getAllRequests,
  getRequestById,
  createNewRequest,
  deleteRequest,
  updateRequestStatus
}
