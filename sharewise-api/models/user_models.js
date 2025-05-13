const db = require('../database/db.js');

class User {

  constructor({ id, username, email, password, user_type }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.user_type = user_type;
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
    const { username, email, password, user_type } = data;
    const response = await db.query(
        'INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *;',
        [username, email, password, user_type]
    );
    const userId = response.rows[0].id;
    const newUser = await User.getOneById(userId);
    return newUser;
}

async update(data) {
  const { username, email, password } = data;
  const result = await db.query(
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *;",
      [username, email, password, this.id]
  );
  return new User(result.rows[0]);
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