const Request = require('../models/Request');
const db = require('../database/db');

jest.mock('../database/db');

describe('Request Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return array of Request instances', async () => {
      const fakeRows = [
        {
          request_id: 1,
          school_id: 2,
          item_name: 'Books',
          request_status: 'pending',
          quantity: 10,
          fulfilled_quantity: 0,
          request_date: '2023-01-01',
          school_name: 'Test School',
          school_address: '123 St',
        },
      ];

      db.query.mockResolvedValue({ rows: fakeRows });

      const requests = await Request.getAll();

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(requests).toHaveLength(1);
      expect(requests[0]).toBeInstanceOf(Request);
      expect(requests[0].itemName).toBe('Books');
    });

    it('should throw error if no requests found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Request.getAll()).rejects.toThrow('No requests found');
    });
  });

  describe('getBySchoolId', () => {
    it('should return array of Request instances filtered by schoolId', async () => {
      const schoolId = 2;
      const fakeRows = [
        {
          request_id: 3,
          school_id: schoolId,
          item_name: 'Pencils',
          request_status: 'approved',
          quantity: 50,
          fulfilled_quantity: 0,
          request_date: '2023-01-05',
          school_name: 'Another School',
          school_address: '456 Ave',
        },
      ];

      db.query.mockResolvedValue({ rows: fakeRows });

      const requests = await Request.getBySchoolId(schoolId);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [schoolId]);
      expect(requests).toHaveLength(1);
      expect(requests[0]).toBeInstanceOf(Request);
      expect(requests[0].schoolId).toBe(schoolId);
      expect(requests[0].itemName).toBe('Pencils');
    });
  });

  describe('createRequest', () => {
    it('should create and return new Request', async () => {
      const schoolId = 5;
      const data = { itemName: 'Chairs', quantity: 20 };

      const insertedRow = {
        request_id: 10,
        school_id: schoolId,
        item_name: data.itemName,
        quantity: data.quantity,
        request_status: null,
        fulfilled_quantity: 0,
        request_date: '2023-01-10',
        school_name: null,
        school_address: null,
      };

      db.query.mockResolvedValue({ rows: [insertedRow] });

      const newRequest = await Request.createRequest(schoolId, data);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [schoolId, data.itemName, data.quantity]);
      expect(newRequest).toBeInstanceOf(Request);
      expect(newRequest.itemName).toBe('Chairs');
    });

    it('should throw error if creation fails', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Request.createRequest(1, { itemName: 'Desks', quantity: 5 })).rejects.toThrow('Failed to create request');
    });
  });

  describe('deleteById', () => {
    it('should delete request and return deleted Request instance', async () => {
      const id = 7;
      const deletedRow = {
        request_id: id,
        school_id: 3,
        item_name: 'Tables',
        request_status: 'deleted',
        quantity: 15,
        fulfilled_quantity: 0,
        request_date: '2023-02-01',
        school_name: 'Deleted School',
        school_address: '789 Rd',
      };

      db.query.mockResolvedValue({ rows: [deletedRow] });

      const result = await Request.deleteById(id);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [id]);
      expect(result).toBeInstanceOf(Request);
      expect(result.requestId).toBe(id);
    });

    it('should throw error if no request found to delete', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Request.deleteById(100)).rejects.toThrow('Request not found or already deleted');
    });
  });

  describe('updateStatus', () => {
    it('should update the request status and return updated Request', async () => {
      const id = 11;
      const newStatus = 'approved';
      const updatedRow = {
        request_id: id,
        school_id: 4,
        item_name: 'Markers',
        request_status: newStatus,
        quantity: 30,
        fulfilled_quantity: 0,
        request_date: '2023-03-15',
        school_name: 'Update School',
        school_address: '321 Blvd',
      };

      db.query.mockResolvedValue({ rows: [updatedRow] });

      const reqInstance = new Request(updatedRow);
      const result = await reqInstance.updateStatus(id, newStatus);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [newStatus, id]);
      expect(result).toBeInstanceOf(Request);
      expect(result.requestStatus).toBe(newStatus);
    });

    it('should throw error if update fails', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const reqInstance = new Request({});
      await expect(reqInstance.updateStatus(20, 'pending')).rejects.toThrow('Request not found or status not updated');
    });
  });

  // New tests to cover updateRequestFulfillment method branches
  describe('updateRequestFulfillment', () => {
    it('should throw error if request not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });
      await expect(Request.updateRequestFulfillment(1, 5)).rejects.toThrow('Request not found');
    });

    it('should set status to fulfilled if fulfilled quantity >= quantity', async () => {
      const dbResponse = {
        rows: [{ quantity: 10, fulfilled_quantity: 8, school_id: 2 }]
      };
      db.query.mockResolvedValueOnce(dbResponse);  // SELECT
      db.query.mockResolvedValueOnce();            // UPDATE

      const result = await Request.updateRequestFulfillment(1, 3); // 8 + 3 = 11 >= 10
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result.newStatus).toBe('fulfilled');
      expect(result.requestId).toBe(1);
      expect(result.schoolId).toBe(2);
    });

    it('should set status to partially fulfilled if fulfilled quantity > 0 but less than quantity', async () => {
      const dbResponse = {
        rows: [{ quantity: 10, fulfilled_quantity: 2, school_id: 2 }]
      };
      db.query.mockResolvedValueOnce(dbResponse);  // SELECT
      db.query.mockResolvedValueOnce();            // UPDATE

      const result = await Request.updateRequestFulfillment(1, 5); // 2 + 5 = 7 < 10
      expect(result.newStatus).toBe('partially fulfilled');
    });

    it('should set status to pending if fulfilled quantity is 0', async () => {
      const dbResponse = {
        rows: [{ quantity: 10, fulfilled_quantity: 0, school_id: 2 }]
      };
      db.query.mockResolvedValueOnce(dbResponse);  // SELECT
      db.query.mockResolvedValueOnce();            // UPDATE

      const result = await Request.updateRequestFulfillment(1, 0); // 0 + 0 = 0
      expect(result.newStatus).toBe('pending');
    });
  });
});
