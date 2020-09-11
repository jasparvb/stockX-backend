/** Routes for lists. */

const express = require("express");
const router = express.Router({ mergeParams: true });

const { authRequired } = require("../middleware/auth");

const List = require("../models/list");


/** GET / => {lists: [list, ...]} */

router.get("/", authRequired, async function(req, res, next) {
  try {
    const lists = await List.findAll(req.username);
    return res.json({lists});
  }

  catch (err) {
    return next(err);
  }
});

/** GET /[listid] => {list: list} */

router.get("/:id", authRequired, async function(req, res, next) {
  try {
    const list = await List.findOne(req.params.id);
    return res.json({list});
  }

  catch (err) {
    return next(err);
  }
});

/** POST / {listData} => {list: list} */

router.post("/", authRequired, async function(req, res, next) {
  try {
    const list = await List.create(req.body, req.username);
    debugger;
    return res.status(201).json({list});
  }

  catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  {message: "List deleted"}  */

router.delete("/:id", authRequired, async function(req, res, next) {
  try {
    await List.remove(req.params.id);
    return res.json({ message: "List deleted" });
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;
