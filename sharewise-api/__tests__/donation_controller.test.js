const request = require('supertest');
const express = require('express');
const donationController = require('../controllers/donation');
const Donation = require('../models/Donation');

jest.mock('../models/Donation');

const app = express();
app.use(express.json());

// Define routes matching controller methods
app.post('/donations', donationController.createDonation);
app.get('/donations', donationController.getAllDonations);
app.get('/donations/:id', donationController.getDonationById);
app.get('/donor/:donorId/donations', donationController.getDonationByDonorId);
app.delete('/donations/:id', donationController.deleteDonation);

describe('Donation Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDonation', () => {
    it('should create a new donation and respond with 201 and success', async () => {
      const mockData = { amount: 100, donorId: 'donor1' };
      const mockResult = { id: '1', ...mockData };
      Donation.createDonation.mockResolvedValue(mockResult);

      const res = await request(app).post('/donations').send(mockData);

      expect(Donation.createDonation).toHaveBeenCalledWith(mockData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        donation: mockResult,
      });
    });

    it('should respond with 500 on error', async () => {
      Donation.createDonation.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/donations').send({});

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB error' });
    });
  });

  describe('getAllDonations', () => {
    it('should return all donations with 200 status', async () => {
      const mockDonations = [{ id: '1' }, { id: '2' }];
      Donation.getAll.mockResolvedValue(mockDonations);

      const res = await request(app).get('/donations');

      expect(Donation.getAll).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        donations: mockDonations,
      });
    });

    it('should respond with 500 on error', async () => {
      Donation.getAll.mockRejectedValue(new Error('DB failure'));
      const res = await request(app).get('/donations');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'DB failure' });
    });
  });

  describe('getDonationById', () => {
    it('should return a donation by id with 200 status', async () => {
      const mockDonation = { id: '1', amount: 50 };
      Donation.getById.mockResolvedValue(mockDonation);

      const res = await request(app).get('/donations/1');

      expect(Donation.getById).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        donation: mockDonation,
      });
    });

    it('should respond with 404 on error', async () => {
      Donation.getById.mockRejectedValue(new Error('Not found'));
      const res = await request(app).get('/donations/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });
  });

  describe('getDonationByDonorId', () => {
    it('should return donations by donor id with 200 status', async () => {
      const mockDonations = [{ id: '1' }];
      Donation.getByDonorId.mockResolvedValue(mockDonations);

      const res = await request(app).get('/donor/donor1/donations');

      expect(Donation.getByDonorId).toHaveBeenCalledWith('donor1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        donations: mockDonations,
      });
    });

    it('should respond with 404 on error', async () => {
      Donation.getByDonorId.mockRejectedValue(new Error('Not found'));
      const res = await request(app).get('/donor/donor999/donations');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });
  });

  describe('deleteDonation', () => {
    it('should delete a donation and respond with 200 and success', async () => {
      const mockDeleted = { id: '1', deleted: true };
      Donation.deleteById.mockResolvedValue(mockDeleted);

      const res = await request(app).delete('/donations/1');

      expect(Donation.deleteById).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        deletedDonation: mockDeleted,
      });
    });

    it('should respond with 404 on error', async () => {
      Donation.deleteById.mockRejectedValue(new Error('Not found'));
      const res = await request(app).delete('/donations/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Not found' });
    });
  });
});
