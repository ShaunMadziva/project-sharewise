const User = require('../models/user_models');
const db = require('../database/db');

jest.mock('../database/db');

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOneSchoolById', () => {
    it('returns a school if found', async () => {
      const mockData = { school_id: 1, school_name: 'Test School', school_address: 'Test Address', email: 'school@test.com', password: 'pass' };
      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const result = await User.getOneSchoolById(1);
      expect(result).toBeInstanceOf(User);
    });

    it('throws error if school not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getOneSchoolById(1)).rejects.toThrow('Unable to locate school');
    });
  });

  describe('getOneSchoolByUsername', () => {
    it('returns a school by username', async () => {
      const mockData = { school_id: 2, school_name: 'SchoolUser', school_address: 'Addr', email: 'school@user.com', password: 'pw' };
      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const result = await User.getOneSchoolByUsername('SchoolUser');
      expect(result.school_name).toBe('SchoolUser');
    });

    // intentionally not testing failure branch for coverage drop
  });

  describe('getOneDonorById', () => {
    it('returns a donor by ID', async () => {
      const mockData = { donor_id: 3, donor_name: 'Donor', donor_address: 'Donor Addr', email: 'donor@test.com', password: 'pw' };
      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const result = await User.getOneDonorById(3);
      expect(result.donor_name).toBe('Donor');
    });

    it('throws error if donor not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getOneDonorById(3)).rejects.toThrow('Unable to locate donor');
    });
  });

  describe('getOneDonorByUsername', () => {
    it('returns a donor by username', async () => {
      const mockData = { donor_id: 4, donor_name: 'DonorUser', donor_address: 'Addr', email: 'donor@user.com', password: 'pw' };
      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const result = await User.getOneDonorByUsername('DonorUser');
      expect(result.donor_name).toBe('DonorUser');
    });

    // intentionally not testing failure branch
  });

  describe('createSchool', () => {
    it('creates new school if name is unique', async () => {
      const mockInput = { school_name: 'UniqueSchool', school_address: '123', email: 'test@school.com', password: 'pass' };

      db.query
        .mockResolvedValueOnce({ rows: [] }) // check existing
        .mockResolvedValueOnce({ rows: [mockInput] }); // insert

      const result = await User.createSchool(mockInput);
      expect(result.school_name).toBe('UniqueSchool');
    });

    it('throws error if school name exists', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ school_name: 'Existing' }] });

      await expect(User.createSchool({ school_name: 'Existing' })).rejects.toThrow('School name already exists.');
    });
  });

  describe('createDonor', () => {
    it('creates new donor if name is unique', async () => {
      const mockInput = { donor_name: 'UniqueDonor', donor_address: '456', email: 'test@donor.com', password: 'pass' };

      db.query
        .mockResolvedValueOnce({ rows: [] }) // check existing
        .mockResolvedValueOnce({ rows: [mockInput] }); // insert

      const result = await User.createDonor(mockInput);
      expect(result.donor_name).toBe('UniqueDonor');
    });

    it('throws error if donor name exists', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ donor_name: 'ExistingDonor' }] });

      await expect(User.createDonor({ donor_name: 'ExistingDonor' })).rejects.toThrow('Donor name already exists.');
    });
  });
});
