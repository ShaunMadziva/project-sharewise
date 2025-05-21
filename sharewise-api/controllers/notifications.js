const Notification = require('../models/Notification');

const getSchoolNotifications = async (req, res) => {
  try {
    const schoolId = req.user.school_id
    console.log("Fetching notifications for school:", schoolId);
    const notifications = await Notification.getNotificationsForSchool(schoolId)
    res.json(notifications);
  } catch (err) {
    console.error({ error: err.message || 'Failed to fetch notifications'});
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

const deleteNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id
    const deleted = await Notification.deleteById(notificationId)
    res.status(200).json({ success: true, deleted })
  }catch(err){
    res.status(404).json({ error: err.message })
  }
}

module.exports = {
  getSchoolNotifications,
  markNotificationAsRead,
  deleteNotificationById
};
