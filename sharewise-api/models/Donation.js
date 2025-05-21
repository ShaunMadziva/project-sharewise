const db = require("../database/db");

class Donation {
  constructor({
    donation_id,
    donor_id,
    request_id,
    quantity,
    item_name,
    item_description,
  }) {
    this.donationId = donation_id;
    this.donorId = donor_id;
    this.requestId = request_id;
    this.quantity = quantity;
    this.itemName = item_name;
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

  static async getByDonorId(donorId) {
   
    const query = `
    SELECT
      d.donation_id,
      d.donor_id,
      d.request_id,
      d.quantity,
      d.item_description,
      r.item_name,
      r.request_status,
      r.request_date,
      s.school_name,
      dn.donor_name
    FROM donation d
    JOIN request r ON d.request_id = r.request_id
    JOIN school s ON r.school_id = s.school_id
    JOIN donor dn ON d.donor_id = dn.donor_id
    WHERE d.donor_id = $1`;
    const response = await db.query(query, [donorId]);
    if (response.rows.length === 0) {
      throw Error("No donations found for this donor");
    }
    return response.rows.map((row) =>({
      
    donationId: row.donation_id,
    donorId: row.donor_id,
    requestId: row.request_id,
    quantity: row.quantity,
    description: row.item_description,
    itemName: row.item_name,
    status: row.request_status,
    donationDate: row.request_date,
    schoolName: row.school_name,
    donorName: row.donor_name
    }));
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
