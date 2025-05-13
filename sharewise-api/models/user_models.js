const db = require('../database/db.js');

class User {

  constructor({ id, username, email, password, total_score, isAdmin, session_ids }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.total_score = total_score;
    this.isAdmin = isAdmin;
    this.session_ids = [];
  }

  static async getAll() {
    const response = await db.query("SELECT * FROM users;");
    if (response.rows.length === 0) {
      throw new Error("No users available.")
    }

    return response.rows.map(u => new User(u));
  }

  static async getOneById(id) {
    const response = await db.query("SELECT * FROM users WHERE id = $1;", [id]);

    if (response.rows.length != 1) {
      throw new Error("Unable to locate user.")
    }

    return new User(response.rows[0]);
  }

  static async getOneByUsername(username) {
    const response = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (response.rows.length != 1) {
        throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
}

  static async create(data) {
    console.log("create user model")
    console.log(data)
    const { username, email, password } = data;
    const response = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;', [username, email, password]);
    const userId = response.rows[0].id;
    const newUser = await User.getOneById(userId);
    return newUser;
  }

  async update(data) { //NOTE: when you call this method to update the total_score, it adds the score given in the request to the existing score in the DB, rather than just replacing it
    const { username, email, password, total_score, isAdmin } = data;

    const response = await db.query(
      `UPDATE users 
       SET 
         username = COALESCE($1, username), 
         email = COALESCE($2, email), 
         password = COALESCE($3, password), 
         total_score = total_score + COALESCE($4, 0), 
         isAdmin = COALESCE($5, isAdmin) 
       WHERE id = $6 
       RETURNING *;`,
      [username, email, password, total_score, isAdmin, this.id]
    );

    if (response.rows.length != 1) {
      throw new Error("Unable to update user.");
    }

    return new User(response.rows[0]);
  }

  async destroy(data) {
    const response = await db.query('DELETE FROM users WHERE id = $1 RETURNING *;', [data.id]);
    if (response.rows.length != 1) {
      throw new Error("Unable to delete user.")
    }

    return new User(response.rows[0]);
  }
}

module.exports = User;