const db = require('../database/db.js');

class User {

  constructor({ school_id, donor_id, donor_name, school_name, school_address, donor_address, email, password}) {
    this.school_id = school_id;
    this.donor_id = donor_id;
    this.donor_name = donor_name;
    this.school_name = school_name;
    this.school_address = school_address;
    this.donor_address = donor_address;
    this.email = email;
    this.password = password;
  }

  static getOneSchoolById = async (id) => {
    const response = await db.query("SELECT * FROM school WHERE school_id = $1;", [id])
    if (response.rows.length != 1) {
        throw Error("Unable to locate school")
    }
    return new User(response.rows[0])
  }

  static getOneSchoolByUsername = async (username) => {
    const response = await db.query("SELECT * FROM school WHERE school_name = $1;", [username])
    if (response.rows.length != 1) {
        throw new Error("Unable to locate school")
    }
    return new User(response.rows[0])
  }

  static getOneDonorById = async (id) => {
    const response = await db.query("SELECT * FROM donor WHERE donor_id = $1;", [id])
    if (response.rows.length != 1) {
        throw Error("Unable to locate donor")
    }
    return new User(response.rows[0])
  }

  static getOneDonorByUsername = async (username) => {
    const response = await db.query("SELECT * FROM donor WHERE donor_name = $1;", [username])
    if (response.rows.length != 1) {
        throw new Error("Unable to locate donor")
    }
    return new User(response.rows[0])
  }

  static async createSchool(data) {
    const existing = await db.query("SELECT * FROM school WHERE school_name = $1", [data.school_name]);
    if (existing.rows.length > 0) {
      throw new Error("School name already exists.");
    }
  
    const { school_name, school_address, email, password } = data;
    const response = await db.query(
      'INSERT INTO school (school_name, school_address, email, password) VALUES ($1, $2, $3, $4) RETURNING *;',
      [school_name, school_address, email, password]
    );
    return new User(response.rows[0]);
  }

  static async createDonor(data) {
    const existing = await db.query("SELECT * FROM donor WHERE donor_name = $1", [data.donor_name]);
    if (existing.rows.length > 0) {
      throw new Error("Donor name already exists.");
    }
  
    const { donor_name, donor_address, email, password } = data;
    const response = await db.query(
      'INSERT INTO donor (donor_name, donor_address, email, password) VALUES ($1, $2, $3, $4) RETURNING *;',
      [donor_name, donor_address, email, password]
    );
    return new User(response.rows[0]);
  }

}

module.exports = User;