const db = require("../database/db");

class Request {
  constructor({
    request_id,
    school_id,
    item_name,
    request_status,
    quantity,
    fulfilled_quantity,
    request_date,
    school_name,
    school_address
  }) {
    this.requestId = request_id
    this.schoolId = school_id
    this.itemName = item_name
    this.requestStatus = request_status
    this.quantity = quantity
    this.fulfilledQuantity = fulfilled_quantity
    this.requestDate = request_date
    this.schoolName = school_name
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

  static async getBySchoolId(schoolId) {
    const response = await db.query(
      "SELECT request.request_id, request.school_id, request.item_name, request.request_status, request.quantity, request.request_date, school.school_name, school.school_address FROM request JOIN school ON request.school_id = school.school_id WHERE request.school_id = $1",
      [schoolId]
    );
    return response.rows.map(row => new Request(row));
  }

  static async updateRequestFulfillment(client, requestId, addQuantity) {
    const res = await db.query(
      `SELECT quantity, fulfilled_quantity, school_id FROM request WHERE request_id = $1`,
      [requestId]
    );
  
    if (res.rows.length === 0) {
      throw new Error("Request not found")
    }
  
    const request = res.rows[0];
    const newFulfilled = (request.fulfilled_quantity || 0) + addQuantity
  
    let newStatus = "pending"
    if (newFulfilled >= request.quantity) {
      newStatus = "fulfilled"
    } else if (newFulfilled > 0) {
      newStatus = "partially fulfilled"
    }
  
    await db.query(
      `UPDATE request SET fulfilled_quantity = $1, request_status = $2 WHERE request_id = $3`,
      [newFulfilled, newStatus, requestId]
    );
  
    return { schoolId: request.school_id, requestId, newStatus }
  }
  

  static async getBySchoolId(schoolId) {
    const response = await db.query(
      "SELECT request.request_id, request.school_id, request.item_name, request.request_status, request.quantity, request.request_date, school.school_name, school.school_address FROM request JOIN school ON request.school_id = school.school_id WHERE request.school_id = $1",
      [schoolId]
    );
    return response.rows.map(row => new Request(row));
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
