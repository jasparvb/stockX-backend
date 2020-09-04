/** Routes for stocks. */

const express = require("express");
const router = express.Router({ mergeParams: true });

const { authRequired } = require("../middleware/auth");

const Stock = require("../models/stock");


/** GET / => {stocks: [stock, ...]} */

router.get("/", authRequired, async function(req, res, next) {
  try {
    const stocks = await Stock.findAll(req.query, req.username);
    return res.json({stocks});
  }

  catch (err) {
    return next(err);
  }
});

/** GET /[stockid] => {stock: stock} */

router.get("/:id", authRequired, async function(req, res, next) {
  try {
    const stock = await Stock.findOne(req.params.id);
    return res.json({stock});
  }

  catch (err) {
    return next(err);
  }
});

/** POST / {stockData} => {stock: stock} */

router.post(
    "/", adminRequired, async function(req, res, next) {
      try {
        const stock = await Stock.create(req.body);
        return res.status(201).json({stock});
      }

      catch (err) {
        return next(err);
      }
    }
);
