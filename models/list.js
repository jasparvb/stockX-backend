const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** Related functions for lists. */

class List {

  /** Return all lists with stocks from a user */

  static async findAll(username) {

    const userLists = await db.query(
      `SELECT id, name
         FROM lists
         WHERE username = $1`,
      [username]);

      const listStocks = await db.query(
        `SELECT s.id, s.ticker, s.name, s.list_id 
        FROM lists AS l
        JOIN stocks AS s ON s.list_id = l.id
        WHERE l.username = $1`,
        [username]);
      
      const lists = userLists.rows.map(l => {
        return {
          id: l.id,
          name: l.name,
          stocks: listStocks.rows.filter(s => l.id === s.list_id)
        }
      });

      return lists;
  }
      
  /** Create a list (from data), update db, return new list data. */

  static async create(data, username) {

    const result = await db.query(
        `INSERT INTO lists 
              (name, username)
            VALUES ($1, $2) 
            RETURNING id, name`,
        [
          data.title,
          username
        ]);

    return result.rows[0];
  }

  /** Update list data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Return data for changed list.
   *
   */

  static async update(id, data) {
    let {query, values} = sqlForPartialUpdate(
        "lists",
        data,
        "id",
        id
    );

    const result = await db.query(query, values);
    const list = result.rows[0];

    if (!list) {
      let notFound = new Error(`There is not list with id '${id}`);
      notFound.status = 404;
      throw notFound;
    }

    return list;
  }

  /** Delete given list from database; returns undefined. */

  static async remove(id) {
    const result = await db.query(
        `DELETE FROM lists 
          WHERE id = $1 
          RETURNING id`,
        [id]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There is not list with id '${id}`);
      notFound.status = 404;
      throw notFound;
    }
  }
}


module.exports = List;
