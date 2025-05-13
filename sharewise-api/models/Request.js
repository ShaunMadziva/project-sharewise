const db = require('../../sharewise-db/db')

class Requests {
    constructor({request_id, school_id, item_name, status, quantity }) {
        this.request_id = request_id
        this.school_id = school_id
        this.item_name = item_name
        this.status = status
        this.quantity = quantity
    }

    static async getRequestsInfo() {
        const response = await db.query(
            "SELECT request.request_id, request.item_name, request.quantity, request.status, school_profile.school_name FROM request JOIN school_profile ON request.school_id = school_profile.school_id;")
    
        if(response.rows.length === 0){
            throw new Error("No request info available")
        }
        return response.rows.map(r => new Requests(r))
        }

    static async getRequestById(request_id) {
        const response = await db.query(
            "SELECT * FROM request WHERE request_id = $1;", [request_id]
        )

        if(response.length != 1){
            throw new Error("Unable to get request")
        }
        return new Requests(response.rows[0])
    }
    
    static async postRequest(data) {
        const { item_name, quantity } = data
        const response = await db.query(
            "INSERT INTO request (item_name, quantity, school_id) VALUES ($1, $2, $3) RETURNING *;", [item_name, quantity]
        )

        if(response.length === 0){
            throw new Error("Request unable to be made")
        }

        return new Requests(response.rows[0])
    }

    async updateStatus(updatedStatus){
    validStatues = ["pending", "approved"]
    if(!validStatues.includes(updatedStatus)){
        throw new Error("Invalid status")
    }
    const response = await db.query(
        "UPDATE request SET status = $1 WHERE request_id = $2 RETURNING request_id, status;", [updatedStatus, this.request_id]
    )
    if(response.rows.length != 1){
        throw new Error(`Unable to update ${this.request_id}`)
    }

    return new Requests(response.rows[0])
    }

    async destroy() {
        const response = await db.query(
            "DELETE FROM requests WHERE request_id = $1 RETURNING *;", [this.request_id]
        )
        return new Requests(response.rows[0])
    }
}

module.exports = {
    Requests
}