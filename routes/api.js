/** Routes for IEXCloud API calls */

const express = require("express");
const router = express.Router({ mergeParams: true });

const StockXApi = require("../helpers/stockXApi");


/** GET / => {stocks: [{"symbol"...}, ...]} */

router.get("/search/:query", async function(req, res, next) {
  try {
    const stocks = await StockXApi.search(req.params.query);
    return res.json({stocks});
  }

  catch (err) {
    return next(err);
  }
});

/** GET / => {stock: [{"name"...}, ...]} */

router.get("/stock/:ticker", async function(req, res, next) {
  try {
    const stock = await StockXApi.stockDetails(req.params.ticker);
    return res.json({stock});
  }

  catch (err) {
    return next(err);
  }
});

/** GET / => {quote: [{"minute"...}, ...]} */

router.get("/quote/:ticker/:range", async function(req, res, next) {
  try {
    const quote = await StockXApi.stockQuote(req.params.ticker, req.params.range);
    return res.json({quote});
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;