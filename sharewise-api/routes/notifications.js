const express = require('express')
const fullfillDonationRouter = express.Router()
const fulfillDonationController = require('../controllers/fulfillDonationController');
const notificationController = require('../controllers/notifications')
const authenticateToken = require("../middleware/authmiddleware")


fullfillDonationRouter.post('/', fulfillDonationController.handleRequest);
fullfillDonationRouter.get('/:id', authenticateToken, notificationController.getSchoolNotifications);

module.exports = fullfillDonationRouter;
