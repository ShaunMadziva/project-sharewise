const Donation = require('../models/Donation')
const Request = require('../models/Request')
const Notification = require('../models/Notification')


const handleRequest = async(req, res) => {

    try{
      data = req.body
      const donation = await Donation.createDonation(data)

      const requestId = req.body.requestId
      const donatedQuantity = req.body.quantity
      const result = await Request.updateRequestFulfillment(requestId, donatedQuantity)

      const schoolId = result.schoolId
      const updatedRequestId = result.requestId
      const newStatus = result.newStatus

      await Notification.sendNotification(schoolId, updatedRequestId, newStatus);

      res.status(201).json(donation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


module.exports = { handleRequest }
