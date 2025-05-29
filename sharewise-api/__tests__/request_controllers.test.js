const {
  getAllRequests,
  getRequestById,
  getRequestsBySchoolId,
  createNewRequest,
  deleteRequest,
  updateRequestStatus,
} = require('../controllers/request');

const Request = require('../models/Request');  // <- fixed import (no destructuring)

jest.mock('../models/Request');

describe('Request Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { school_id: 1 },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAllRequests', () => {
    it('should respond with all requests and 200', async () => {
      const mockRequests = [{ requestId: 1 }, { requestId: 2 }];
      Request.getAll.mockResolvedValueOnce(mockRequests);

      await getAllRequests(req, res);

      expect(Request.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, requests: mockRequests });
    });

    it('should handle error and respond with 500', async () => {
      Request.getAll.mockRejectedValueOnce(new Error('DB error'));

      await getAllRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('getRequestById', () => {
    it('should respond with request and 200', async () => {
      const mockRequest = { requestId: 1 };
      req.params.id = '1';
      Request.getById = jest.fn().mockResolvedValueOnce(mockRequest);

      await getRequestById(req, res);

      expect(Request.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, request: mockRequest });
    });

    it('should handle not found error and respond with 404', async () => {
      req.params.id = '999';
      Request.getById = jest.fn().mockRejectedValueOnce(new Error('Request not found'));

      await getRequestById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request not found' });
    });
  });

  describe('getRequestsBySchoolId', () => {
    it('should respond with requests by schoolId and 200', async () => {
      const mockRequests = [{ requestId: 1 }];
      req.params.schoolId = '1';
      Request.getBySchoolId.mockResolvedValueOnce(mockRequests);

      await getRequestsBySchoolId(req, res);

      expect(Request.getBySchoolId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ requests: mockRequests });
    });

    it('should handle error and respond with 500', async () => {
      req.params.schoolId = '1';
      Request.getBySchoolId.mockRejectedValueOnce(new Error('DB failure'));

      await getRequestsBySchoolId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB failure' });
    });
  });

  describe('createNewRequest', () => {
    it('should create a new request and respond with 201', async () => {
      const mockRequest = { requestId: 1 };
      req.body = { itemName: 'Books', quantity: 10 };
      Request.createRequest.mockResolvedValueOnce(mockRequest);

      await createNewRequest(req, res);

      expect(Request.createRequest).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, request: mockRequest });
    });

    it('should handle error and respond with 500', async () => {
      req.body = { itemName: 'Books', quantity: 10 };
      Request.createRequest.mockRejectedValueOnce(new Error('Insert failed'));

      await createNewRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insert failed' });
    });
  });

  describe('deleteRequest', () => {
    it('should delete the request and respond with 200', async () => {
      const mockDeleted = { requestId: 1 };
      req.params.id = '1';
      Request.deleteById.mockResolvedValueOnce(mockDeleted);

      await deleteRequest(req, res);

      expect(Request.deleteById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, deleted: mockDeleted });
    });

    it('should handle error and respond with 404', async () => {
      req.params.id = '999';
      Request.deleteById.mockRejectedValueOnce(new Error('Request not found'));

      await deleteRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Request not found' });
    });
  });

  describe('updateRequestStatus', () => {
    it('should update request status and respond with 200', async () => {
      const mockUpdated = { requestId: 1, requestStatus: 'approved' };
      req.params.id = '1';
      req.body.status = 'approved';
      Request.updateStatus.mockResolvedValueOnce(mockUpdated);

      await updateRequestStatus(req, res);

      expect(Request.updateStatus).toHaveBeenCalledWith(1, 'approved');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, updated: mockUpdated });
    });

    it('should handle error and respond with 400', async () => {
      req.params.id = '1';
      req.body.status = 'approved';
      Request.updateStatus.mockRejectedValueOnce(new Error('Update failed'));

      await updateRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
    });
  });
});
