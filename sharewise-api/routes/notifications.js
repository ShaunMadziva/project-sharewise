const express = require('express')
const fullfillDonationRouter = express.Router()
const fulfillDonationController = require('../controllers/fulfillDonationController')
const notificationController = require('../controllers/notifications')
const authenticateToken = require("../middleware/authmiddleware")


fullfillDonationRouter.post('/', fulfillDonationController.handleRequest)
fullfillDonationRouter.get('/:id', authenticateToken, notificationController.getSchoolNotifications)
fullfillDonationRouter.post('/:id/read', notificationController.markNotificationAsRead)
fullfillDonationRouter.delete('/:id', notificationController.deleteNotificationById);

module.exports = fullfillDonationRouter;
