const db = require("../database/connect");

class Donation {
  constructor({ donation_id, donator_profile_id, school_profile_id, quantity, description }) {
    this.donationId = donation_id;
    this.donatorId = donator_profile_id;
    this.schoolId = school_profile_id;
    this.quantity = quantity;
    this.description = description;
  }

  static create = async (data) => {
    const { donatorId, schoolId, quantity, description } = data;
    const response = await db.query(
      `INSERT INTO donation (donator_profile_id, school_profile_id, quantity, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [donatorId, schoolId, quantity, description]
    );

    if (response.rows.length === 0) {
      throw Error("Failed to create donation");
    }

    return new Donation(response.rows[0]);
  };

  static getAll = async () => {
    const response = await db.query("SELECT * FROM donation;");
    return response.rows.map((d) => new Donation(d));
  };

  static getById = async (id) => {
    const response = await db.query(
      "SELECT * FROM donation WHERE donation_id = $1;",
      [id]
    );

    if (response.rows.length === 0) {
      throw Error("Donation not found");
    }

    return new Donation(response.rows[0]);
  };

  static getByDonatorId = async (donatorId) => {
    const response = await db.query(
      "SELECT * FROM donation WHERE donator_profile_id = $1;",
      [donatorId]
    );

    if (response.rows.length === 0) {
      throw Error("No donations found for this donator");
    }

    return response.rows.map((d) => new Donation(d));
  }

  static deleteById = async (id) => {
    const response = await db.query(
      "DELETE FROM donation WHERE donation_id = $1 RETURNING *;",
      [id]
    );

    if (response.rows.length === 0) {
      throw Error("Donation not found or already deleted");
    }

    return new Donation(response.rows[0]);
  };
}

module.exports = {
  Donation
};
