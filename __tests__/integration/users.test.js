process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
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

describe('POST /users', function() {
    test('Creating a new user', async function() {
        const res = await request(app)
        .post('/users')
        .send({
            username: "suarez",  
            password: "copadelRey1",
            email: "suarez@fcb.es"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
        const userTest = await User.findOne("suarez");
        expect(userTest.email).toEqual("suarez@fcb.es");
    });
  
    test('Test creating a user with same username', async function() {
      const res = await request(app)
        .post('/users')
        .send({
            username: "messi10",  
            password: "copadelRey1",
            email: "suarez@fcb.es"
        });
      expect(res.statusCode).toBe(400);
    });
  
    test('Test creating a user without required password field', async function() {
      const res = await request(app)
        .post('/users')
        .send({
            username: "suarez11",  
            email: "suarez@fcb.es"
        });
      expect(res.statusCode).toBe(400);
    });
});
  
describe('GET /users', function() {
    test('Returns list of users', async function() {
        const res = await request(app)
            .get('/users')
            .send({ _token: DATA.token });
        expect(res.body.users).toHaveLength(1);
        expect(res.body.users[0]).toHaveProperty('username');
        expect(res.body.users[0]).not.toHaveProperty('password');
    });
});
  
describe('GET /users/:username', function() {
    test('Returns a user by username', async function() {
        const res = await request(app)
            .get(`/users/${DATA.username}`)
            .send({ _token: DATA.token });
        expect(res.body.user).toHaveProperty('username');
        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body.user.username).toBe('messi10');
    });
  
    test('Responds with 404 if user cannot be found', async function() {
      const res = await request(app)
        .get(`/users/griezman`)
        .send({ _token: DATA.token });
      expect(res.statusCode).toBe(404);
    });
});

describe('PATCH /users/:username', function() {
    test("Updates property of single user", async function() {
        const res = await request(app)
            .patch(`/users/${DATA.username}`)
            .send({ email: 'messiGOAT@fcb.es', _token: DATA.token });
        expect(res.body.user).toHaveProperty('username');
        expect(res.body.user).not.toHaveProperty('password');
        expect(res.body.user.first_name).toBe('messiGOAT@fcb.es');
        expect(res.body.user.username).not.toBe(null);
    });
   
    test('Prevents updating field that does not exist', async function() {
        const res = await request(app)
            .patch(`/users/${DATA.username}`)
            .send({ _token: DATA.token, unknownfield: false });
        expect(res.statusCode).toBe(400);
    });
  
    test('Keeps a user from updating a different user', async function() {
        const res = await request(app)
            .patch(`/users/valverde`)
            .send({ email: 'ernesto@fcb.es', _token: DATA.token });
        expect(res.statusCode).toBe(401);
    });
  
    test('Responds with 404 if user cannot be found', async function() {
        // delete user first
        await request(app)
            .delete(`/users/${DATA.username}`)
            .send({ _token: DATA.token });
        const res = await request(app)
            .patch(`/users/${DATA.username}`)
            .send({ email: 'messiGOAT@fcb.es', _token: DATA.token });
        expect(res.statusCode).toBe(404);
    });
});

describe('DELETE /users/:username', function() {
    test('Deletes a user by username', async function() {
        const res = await request(app)
            .delete(`/users/${DATA.username}`)
            .send({ _token: DATA.token });
        expect(res.body).toEqual({ message: 'User account deleted!' });
    });
  
    test('Does not allow user to delete another user', async function() {
        const res = await request(app)
            .delete(`/users/valverde`)
            .send({ _token: DATA.token });
        expect(res.statusCode).toBe(401);
    });
  
    test('Responds with 404 if user cannot be found', async function() {
        // delete user first
        await request(app)
            .delete(`/users/${DATA.username}`)
            .send({ _token: DATA.token });
        const res = await request(app)
            .delete(`/users/${DATA.username}`)
            .send({ _token: DATA.token });
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
