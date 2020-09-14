/** Routes for stocks. */

const express = require("express");
const router = express.Router({ mergeParams: true });

const { authRequired } = require("../middleware/auth");

const Stock = require("../models/stock");


/** POST / {stockData} => {stock: stock} */

router.post("/", authRequired, async function(req, res, next) {
  try {
    const stock = await Stock.create(req.body);
    return res.status(201).json({stock});
  }

  catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  {message: "Stock deleted"}  */

router.delete("/:id", authRequired, async function(req, res, next) {
  try {
    await Stock.remove(req.params.id);
    return res.json({ message: "Stock deleted" });
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;
