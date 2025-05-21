const {
    getSchoolNotifications,
    markNotificationAsRead,
    deleteNotificationById
  } = require('../controllers/notifications');
  
  const Notification = require('../models/Notification');
  
  jest.mock('../models/Notification');
  
  describe('Notification Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        user: { school_id: 1 },
        params: {}
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      jest.clearAllMocks();
    });
  
    describe('getSchoolNotifications', () => {
      it('should return notifications for a school', async () => {
        const mockNotifications = [{ id: 1, message: 'Test Notification' }];
        Notification.getNotificationsForSchool.mockResolvedValueOnce(mockNotifications);
  
        await getSchoolNotifications(req, res);
  
        expect(Notification.getNotificationsForSchool).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockNotifications);
      });
  
      it('should return 500 on error', async () => {
        Notification.getNotificationsForSchool.mockRejectedValueOnce(new Error('DB error'));
  
        await getSchoolNotifications(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch notifications' });
      });
    });
  
    describe('markNotificationAsRead', () => {
      it('should mark a notification as read', async () => {
        req.params.id = 123;
  
        await markNotificationAsRead(req, res);
  
        expect(Notification.markAsRead).toHaveBeenCalledWith(123);
        expect(res.json).toHaveBeenCalledWith({ message: 'Notification marked as read' });
      });
  
      it('should return 500 on error', async () => {
        req.params.id = 123;
        Notification.markAsRead.mockRejectedValueOnce(new Error('Update failed'));
  
        await markNotificationAsRead(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update notification' });
      });
    });
  
    describe('deleteNotificationById', () => {
      it('should delete a notification and return success', async () => {
        const mockDeleted = { id: 1, message: 'Deleted' };
        req.params.id = 1;
  
        Notification.deleteById.mockResolvedValueOnce(mockDeleted);
  
        await deleteNotificationById(req, res);
  
        expect(Notification.deleteById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, deleted: mockDeleted });
      });
  
      it('should return 404 if deletion fails', async () => {
        req.params.id = 1;
        Notification.deleteById.mockRejectedValueOnce(new Error('Not found'));
  
        await deleteNotificationById(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
      });
    });
  });
  