const Notification = require('../models/Notification');

const getSchoolNotifications = async (req, res) => {
  try {
    const schoolId = req.user.school_id
    const notifications = await Notification.getNotificationsForSchool(schoolId)
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.markAsRead(id)
    res.json({ message: 'Notification marked as read' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' })
  }
};

module.exports = {
  getSchoolNotifications,
  markNotificationAsRead,
};
