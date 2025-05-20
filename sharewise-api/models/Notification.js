const db = require('../database/db');

class Notification {
  constructor({ notification_id, school_id, request_id, message, is_read, created_at, item_name, quantity, request_status, donor_name }) {
    this.id = notification_id
    this.schoolId = school_id
    this.requestId = request_id
    this.message = message
    this.isRead = is_read
    this.createdAt = created_at
    this.itemName = item_name
    this.quantity = quantity
    this.requestStatus = request_status
    this.donorName = donor_name
  }

  static async sendNotification(schoolId, requestId, message) {
    const response = await db.query("INSERT INTO notification (school_id, request_id, message) VALUES ($1, $2, $3) RETURNING *;", [schoolId, requestId, message])

    if (response.rows.length === 0) {
        throw Error("Failed to create request");
      }

    return new Notification(response.rows[0])
  }

  static async getNotificationsForSchool(schoolId) {
    const response = await db.query(
        `SELECT
        n.notification_id,
        n.school_id,
        n.request_id,
        n.message,
        n.is_read,
        n.created_at,
        r.item_name,
        d.quantity,
        r.request_status,
        donor.donor_name
        FROM notification AS n
        LEFT JOIN request AS r ON r.request_id = n.request_id
        LEFT JOIN donation AS d ON d.request_id = r.request_id
        LEFT JOIN donor ON donor.donor_id = d.donor_id
        WHERE n.school_id = $1
        ORDER BY n.created_at DESC;`, [schoolId])
    if (response.rows.length === 0) {
        throw Error("No requests found");
      }
    return response.rows.map(r => new Notification(r))
  }

  static async markAsRead(notificationId) {
    await db.query("UPDATE notification SET is_read = TRUE WHERE notification_id = $1;", [notificationId])
  }
}

module.exports = Notification;