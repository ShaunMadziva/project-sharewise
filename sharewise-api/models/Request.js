const db = require("../database/db");

class Request {
  constructor({
    request_id,
    school_id,
    item_name,
    request_status,
    quantity,
    request_date,
    school_name,
    school_address
  }) {
    this.requestId = request_id;
    this.schoolId = school_id;
    this.itemName = item_name;
    this.requestStatus = request_status;
    this.quantity = quantity;
    this.requestDate = request_date;
    this.schoolName = school_name;
    this.schoolAddress = school_address
  }

  static async getAll() {
    const response = await db.query(
      "SELECT request.request_id, request.item_name, request.quantity, request.request_status, request.request_date, school.school_name, school.school_address FROM request JOIN school ON request.school_id = school.school_id;"
    );
    if (response.rows.length === 0) {
      throw Error("No requests found");
    }
    return response.rows.map((r) => new Request(r));
  }

  static async getById(id) {
    const response = await db.query(
      "SELECT request.request_id, request.school_id, request.item_name, request.request_status, request.quantity, request.request_date, school.school_name, school.school_address FROM request JOIN school ON request.school_id = school.school_id WHERE request.request_id = $1",
      [id]
    );
    if (response.rows.length === 0) {
      throw Error("Request not found");
    }
    return new Request(response.rows[0]);
  }

  static async createRequest(schoolId, data) {
    const { itemName, quantity } = data;

    const response = await db.query(
      `INSERT INTO request (school_id, item_name, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [schoolId, itemName, quantity]
    );

    if (response.rows.length === 0) {
      throw Error("Failed to create request");
    }

    return new Request(response.rows[0]);
  }

  async deleteById(id) {
    const response = await db.query(
      "DELETE FROM request WHERE request_id = $1 RETURNING *",
      [id]
    );
    if (response.rows.length === 0) {
      throw Error("Request not found or already deleted");
    }
    return new Request(response.rows[0]);
  }

  async updateStatus(id, status) {
    const response = await db.query(
      `UPDATE request SET request_status = $1 WHERE request_id = $2 RETURNING *`,
      [status, id]
    );

    if (response.rows.length === 0) {
      throw Error("Request not found or status not updated");
    }

    return new Request(response.rows[0]);
  }
}

module.exports = {
  Request,
};
