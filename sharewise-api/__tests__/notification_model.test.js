const Notification = require('../models/Notification');
const db = require('../database/db');

jest.mock('../database/db');

describe('Notification Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('should insert and return a new notification', async () => {
      const mockRow = {
        notification_id: 1,
        school_id: 10,
        request_id: 20,
        message: 'New request created',
        is_read: false,
        created_at: new Date(),
        item_name: null,
        quantity: null,
        request_status: null,
        donor_name: null
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await Notification.sendNotification(10, 20, 'New request created');

      expect(db.query).toHaveBeenCalledWith(
        "INSERT INTO notification (school_id, request_id, message) VALUES ($1, $2, $3) RETURNING *;",
        [10, 20, 'New request created']
      );

      expect(result).toBeInstanceOf(Notification);
      expect(result.id).toEqual(1);
    });

    it('should throw an error if no row is returned', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Notification.sendNotification(1, 2, 'msg')).rejects.toThrow('Failed to create request');
    });
  });

  describe('getNotificationsForSchool', () => {
    it('should return list of Notification instances', async () => {
      const mockRows = [
        {
          notification_id: 1,
          school_id: 10,
          request_id: 20,
          message: 'Request updated',
          is_read: false,
          created_at: new Date(),
          item_name: 'Notebooks',
          quantity: 100,
          request_status: 'Approved',
          donor_name: 'DonorX'
        }
      ];

      db.query.mockResolvedValue({ rows: mockRows });

      const result = await Notification.getNotificationsForSchool(10);

      expect(db.query).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Notification);
      expect(result[0].itemName).toEqual('Notebooks');
    });

    it('should return empty array if no notifications found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await Notification.getNotificationsForSchool(123);
      expect(result).toEqual([]);
    });
  });

  describe('markAsRead', () => {
    it('should call update query to mark notification as read', async () => {
      db.query.mockResolvedValue({});

      await Notification.markAsRead(5);

      expect(db.query).toHaveBeenCalledWith(
        "UPDATE notification SET is_read = TRUE WHERE notification_id = $1;",
        [5]
      );
    });
  });

  describe('deleteById', () => {
    it('should delete a notification and return it', async () => {
      const mockRow = {
        notification_id: 1,
        school_id: 10,
        request_id: 20,
        message: 'To be deleted',
        is_read: false,
        created_at: new Date(),
        item_name: null,
        quantity: null,
        request_status: null,
        donor_name: null
      };

      db.query.mockResolvedValue({ rows: [mockRow] });

      const result = await Notification.deleteById(1);

      expect(db.query).toHaveBeenCalledWith(
        "DELETE FROM notification where notification_id = $1 RETURNING *;",
        [1]
      );

      expect(result).toBeInstanceOf(Notification);
      expect(result.id).toEqual(1);
    });

    it('should throw error if notification not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Notification.deleteById(999)).rejects.toThrow('Notification not found or already deleted');
    });
  });
});
