process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DATA = {};

beforeEach(async function() {
  try {
    // Create a test user with token
    const hashedPW = await bcrypt.hash('testpassword', 1);
    await db.query(
        `INSERT INTO users (username, password, email)
        VALUES ('messi10', $1, 'messi@fcb.es')`,
        [hashedPW]
    );

    const res = await request(app)
        .post('/login')
        .send({username: 'messi10', password: 'testpassword'});

    DATA.token = res.body.token;
    DATA.username = jwt.decode(DATA.token).username;

    // Insert a test list into "lists"
    const result = await db.query(
      'INSERT INTO lists (name, username) VALUES ($1, $2) RETURNING *',
      ['Technology Stocks', 'messi10']
    );

    DATA.list = result.rows[0];

    const stock = await db.query(
      "INSERT INTO stocks (ticker, name, list_id) VALUES ('WMT', 'Walmart Inc', $1) RETURNING *",
      [DATA.list.id]
    );
    DATA.stockId = stock.rows[0].id;

  } catch (err) {
    console.error(err);
  }
});


describe("POST /stocks", function () {
    test("Creates a new stock", async function () {
      const res = await request(app)
          .post(`/stocks`)
          .send({
              ticker: "TSLA",
              name: "Tesla",
              list_id: DATA.list.id,
              _token: DATA.token
          });
      expect(res.statusCode).toBe(201);
      expect(res.body.stock).toHaveProperty("id");
    });
});


describe("DELETE /stocks/:id", function () {
    test("Deletes a stock", async function () {
        const res = await request(app)
            .delete(`/stocks/${DATA.stockId}`).send({_token: DATA.token});
        expect(res.body).toEqual({message: "Stock deleted"});
    });
  
  
    test("Responds with 404 if stock cannot be found", async function () {
        // delete stock, then try to delete again
        await request(app)
            .delete(`/stocks/${DATA.stockId}`).send({_token: DATA.token});
        const res = await request(app)
            .delete(`/stocks/${DATA.stockId}`).send({_token: DATA.token});
        expect(res.statusCode).toBe(404);
    });
});
    


afterEach(async function() {
  try {
    await db.query('DELETE FROM stocks');
    await db.query('DELETE FROM lists');
    await db.query('DELETE FROM users');
  } catch (err) {
    console.error(err);
  }
});

afterAll(async function() {
  try {
    await db.end();
  } catch (err) {
    console.error(err);
  }
});
