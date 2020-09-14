/** Routes for lists. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const { listNewSchema } = require("../schemas");
const { validate } = require("jsonschema");

const { authRequired } = require("../middleware/auth");
const StockXApi = require("../helpers/stockXApi");
const { getSymbols } = require("../helpers/getSymbols");

const List = require("../models/list");


/** GET / => {lists: [list, ...]} */

router.get("/", authRequired, async function(req, res, next) {
  try {
    let listsRes = await List.findAll(req.username);
    if(listsRes) {
      let symbols = getSymbols(listsRes);
      if(symbols) {
        const lists = await StockXApi.getListPrices(listsRes, symbols);
        return res.json({lists});
      } 
    } else {
      return res.json({lists: []});
    }
    return res.json({lists: listsRes});
  }

  catch (err) {
    return next(err);
  }
});


/** POST / {listData} => {list: list} */

router.post("/", authRequired, async function(req, res, next) {
  try {
    const validation = validate(req.body, listNewSchema);

    if (!validation.valid) {
      return next({
        status: 400,
        message: validation.errors.map(e => e.stack)
      });
    }

    const list = await List.create(req.body, req.username);
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
