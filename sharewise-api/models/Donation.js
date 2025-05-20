const db = require("../database/db");

class Donation {
  constructor({
    donation_id,
    donor_id,
    request_id,
    quantity,
    item_description,
  }) {
    this.donationId = donation_id;
    this.donorId = donor_id;
    this.requestId = request_id;
    this.quantity = quantity;
    this.description = item_description;
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM donation");
    if (response.rows.length === 0) {
      throw Error("No donations found");
    }
    return response.rows.map((row) => new Donation(row));
  }

  static async createDonation(data) {
    const { donorId, requestId, quantity, description } = data;

    const quantityInt = parseInt(quantity, 10);

    const response = await db.query(
      `INSERT INTO donation (donor_id, request_id, quantity, item_description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [donorId, requestId, quantityInt, description]
    );

    if (response.rows.length === 0) {
      throw Error("Donation could not be created");
    }

    return new Donation(response.rows[0]);
  }

  static async getById(id) {
    const response = await db.query(
      "SELECT * FROM donation WHERE donation_id = $1",
      [id]
    );
    if (response.rows.length === 0) {
      throw Error("Donation not found");
    }
    return new Donation(response.rows[0]);
  }

  static async getByDonorId(donatorId) {
    const response = await db.query(
      "SELECT * FROM donation WHERE donor_id = $1",
      [donatorId]
    );
    if (response.rows.length === 0) {
      throw Error("No donations found for this donor");
    }
    return response.rows.map((row) => new Donation(row));
  }

  static async deleteById(id) {
    const response = await db.query(
      "DELETE FROM donation WHERE donation_id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      throw Error("Donation not found or already deleted");
    }
    return new Donation(response.rows[0]);
  }
}

module.exports = Donation
