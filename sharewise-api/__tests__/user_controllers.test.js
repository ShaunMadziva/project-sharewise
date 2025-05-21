const { schoolregister, donorregister, schoollogin, donorlogin } = require('../controllers/user_controllers');
const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/user_models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('schoolregister', () => {
    it('should register a new school and return 201', async () => {
      req.body = {
        school_name: 'Test School',
        school_address: '123 St',
        email: 'school@test.com',
        password: 'plainpass'
      };

      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpass');
      User.createSchool.mockResolvedValue({ school_id: 1, ...req.body, password: 'hashedpass' });

      await schoolregister(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 'salt');
      expect(User.createSchool).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashedpass' }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle error during school registration', async () => {
      bcrypt.genSalt.mockRejectedValue(new Error('Salt error'));
      await schoolregister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Salt error' });
    });
  });

  describe('donorregister', () => {
    it('should register a new donor and return 201', async () => {
      req.body = {
        donor_name: 'Donor1',
        donor_address: '456 Ave',
        email: 'donor@test.com',
        password: 'plainpass'
      };

      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpass');
      User.createDonor.mockResolvedValue({ donor_id: 5, ...req.body, password: 'hashedpass' });

      await donorregister(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 'salt');
      expect(User.createDonor).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashedpass' }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle error during donor registration', async () => {
      User.createDonor.mockRejectedValue(new Error('DB error'));
      await donorregister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('schoollogin', () => {
    it('should log in school and return token', async () => {
      req.body = { school_name: 'School1', password: 'pass123' };

      const user = {
        school_id: 1,
        school_name: 'School1',
        password: 'hashedpass',
        email: 'school@email.com',
        school_address: '123 St'
      };

      User.getOneSchoolByUsername.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) => cb(null, 'valid-token'));

      await schoollogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: 'valid-token',
        school_id: 1
      }));
    });

    it('should return 401 if school password is incorrect', async () => {
      req.body = { school_name: 'WrongSchool', password: 'wrongpass' };

      User.getOneSchoolByUsername.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await schoollogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'School could not be authenticated.' });
    });

    it('should return 401 if school not found', async () => {
      req.body = { school_name: 'UnknownSchool', password: 'pass' };
      User.getOneSchoolByUsername.mockResolvedValue(null);

      await schoollogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No school with this username' });
    });

    it('should return 401 if jwt.sign fails', async () => {
      req.body = { school_name: 'School1', password: 'pass123' };

      User.getOneSchoolByUsername.mockResolvedValue({ school_id: 1, school_name: 'School1', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) => cb(new Error('Token error')));

      await schoollogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error in token generation' });
    });
  });

  describe('donorlogin', () => {
    it('should log in donor and return token', async () => {
      req.body = { donor_name: 'Donor1', password: 'testpass' };

      const user = {
        donor_id: 3,
        donor_name: 'Donor1',
        password: 'hashedpass',
        email: 'donor@email.com',
        donor_address: '789 Blvd'
      };

      User.getOneDonorByUsername.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) => cb(null, 'donor-token'));

      await donorlogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: 'donor-token',
        donor_id: 3
      }));
    });

    it('should return 401 if donor password is wrong', async () => {
      req.body = { donor_name: 'WrongDonor', password: 'wrong' };

      User.getOneDonorByUsername.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await donorlogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Donor could not be authenticated.' });
    });

    it('should return 401 if donor not found', async () => {
      req.body = { donor_name: 'MissingDonor', password: 'any' };
      User.getOneDonorByUsername.mockResolvedValue(null);

      await donorlogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No donor with this username' });
    });

    it('should return 401 if token generation fails', async () => {
      req.body = { donor_name: 'Donor', password: 'pass' };

      User.getOneDonorByUsername.mockResolvedValue({ donor_id: 1, donor_name: 'Donor', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation((payload, secret, options, cb) => cb(new Error('JWT error')));

      await donorlogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error in token generation' });
    });
  });
});
