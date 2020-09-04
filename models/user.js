const db = require("../db");
const bcrypt = require("bcrypt");
const partialUpdate = require("../helpers/partialUpdate");

const BCRYPT_WORK_FACTOR = 10;


/** Related functions for users. */

class User {

  /** authenticate user with username, password. Returns user or throws err. */

  static async authenticate(data) {
    // try to find the user first
    const result = await db.query(
        `SELECT username, 
                password 
          FROM users 
          WHERE username = $1`,
        [data.username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        return user;
      }
    }

    const invalidPass = new Error("Invalid Credentials");
    invalidPass.status = 401;
    throw invalidPass;
  }

  /** Register user with data. Returns new user data. */

  static async register(data) {
    const duplicateCheck = await db.query(
        `SELECT username 
            FROM users 
            WHERE username = $1`,
        [data.username]
    );

    if (duplicateCheck.rows[0]) {
      const err = new Error(
          `There already exists a user with username '${data.username}`);
      err.status = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
        `INSERT INTO users 
            (username, password) 
          VALUES ($1, $2) 
          RETURNING username, password`,
        [
          data.username,
          hashedPassword
        ]);

    return result.rows[0];
  }


module.exports = User;
