/** Routes for users. */

const express = require("express");
const router = express.Router();

const { ensureCorrectUser, authRequired } = require("../middleware/auth");

const User = require("../models/user");
const { validate } = require("jsonschema");

const { userNewSchema, userUpdateSchema } = require("../schemas");

const createToken = require("../helpers/createToken");

/** GET / => {users: [user, ...]} */

router.get("/", authRequired, async function(req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => {user: user} */

router.get("/:username", authRequired, async function(req, res, next) {
  try {
    const user = await User.findOne(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
