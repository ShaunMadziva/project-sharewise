const Donation = require('../models/Donation');
const db = require('../database/db');

jest.mock('../database/db');

describe('Donation Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns all donations', async () => {
      const mockRows = [
        { donation_id: 1, donor_id: 2, request_id: 3, quantity: 5, item_description: 'Books' },
        { donation_id: 2, donor_id: 3, request_id: 4, quantity: 10, item_description: 'Pens' },
      ];
      db.query.mockResolvedValue({ rows: mockRows });

      const donations = await Donation.getAll();

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM donation');
      expect(donations).toHaveLength(2);
      expect(donations[0]).toBeInstanceOf(Donation);
    });

    it('throws error when no donations found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Donation.getAll()).rejects.toThrow('No donations found');
    });
  });

  describe('createDonation', () => {
    it('creates and returns a new donation', async () => {
      const data = {
        donorId: 1,
        requestId: 2,
        quantity: '7',
        description: 'Stationery',
      };
      const returnedRow = {
        donation_id: 5,
        donor_id: 1,
        request_id: 2,
        quantity: 7,
        item_description: 'Stationery',
      };
      db.query.mockResolvedValue({ rows: [returnedRow] });

      const donation = await Donation.createDonation(data);

      expect(db.query).toHaveBeenCalledWith(
        `INSERT INTO donation (donor_id, request_id, quantity, item_description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
        [1, 2, 7, 'Stationery']
      );
      expect(donation).toBeInstanceOf(Donation);
      expect(donation.donationId).toBe(5);
    });

    it('throws error if creation fails', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const data = { donorId: 1, requestId: 2, quantity: 5, description: 'Books' };
      await expect(Donation.createDonation(data)).rejects.toThrow('Donation could not be created');
    });
  });

  describe('getById', () => {
    it('returns donation by id', async () => {
      const row = {
        donation_id: 10,
        donor_id: 4,
        request_id: 5,
        quantity: 3,
        item_description: 'Clothes',
      };
      db.query.mockResolvedValue({ rows: [row] });

      const donation = await Donation.getById(10);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM donation WHERE donation_id = $1', [10]);
      expect(donation).toBeInstanceOf(Donation);
      expect(donation.donationId).toBe(10);
    });

    it('throws error if donation not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Donation.getById(999)).rejects.toThrow('Donation not found');
    });
  });

  describe('getByDonorId', () => {
    it('returns donations for a donor with joined info', async () => {
      const rows = [
        {
          donation_id: 1,
          donor_id: 7,
          request_id: 3,
          quantity: 2,
          item_description: 'Food',
          item_name: 'Lunch',
          request_status: 'Fulfilled',
          request_date: '2024-06-01',
          school_name: 'ABC School',
          donor_name: 'John Doe'
        },
      ];
      db.query.mockResolvedValue({ rows });

      const donations = await Donation.getByDonorId(7);

      expect(donations).toHaveLength(1);
      expect(donations[0]).toEqual({
        donationId: 1,
        donorId: 7,
        requestId: 3,
        quantity: 2,
        description: 'Food',
        itemName: 'Lunch',
        status: 'Fulfilled',
        donationDate: '2024-06-01',
        schoolName: 'ABC School',
        donorName: 'John Doe'
      });
    });

    it('throws error if no donations found for donor', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Donation.getByDonorId(123)).rejects.toThrow('No donations found for this donor');
    });
  });

  describe('deleteById', () => {
    it('deletes and returns the deleted donation', async () => {
      const row = {
        donation_id: 15,
        donor_id: 2,
        request_id: 8,
        quantity: 1,
        item_description: 'Shoes',
      };
      db.query.mockResolvedValue({ rows: [row] });

      const deleted = await Donation.deleteById(15);

      expect(db.query).toHaveBeenCalledWith(
        'DELETE FROM donation WHERE donation_id = $1 RETURNING *',
        [15]
      );
      expect(deleted).toBeInstanceOf(Donation);
      expect(deleted.donationId).toBe(15);
    });

    it('throws error if donation not found or already deleted', async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Donation.deleteById(999)).rejects.toThrow('Donation not found or already deleted');
    });
  });
});
