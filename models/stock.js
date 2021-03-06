const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate");


/** Related functions for stocks. */

class Stock {

  /** Create a stock (from data), update db, return new stock data. */

  static async create(data) {

    const result = await db.query(
        `INSERT INTO stocks 
              (ticker, name, list_id)
            VALUES ($1, $2, $3) 
            RETURNING id, ticker, name, list_id`,
        [
          data.ticker,
          data.name,
          data.listId
        ]);

    return result.rows[0];
  }


  /** Delete given stock from database; returns undefined. */

  static async remove(id) {
    const result = await db.query(
        `DELETE FROM stocks 
          WHERE id = $1 
          RETURNING id`,
        [id]);

    if (result.rows.length === 0) {
      let notFound = new Error(`There is no stock with id '${id}`);
      notFound.status = 404;
      throw notFound;
    }
  }
}


module.exports = Stock;
