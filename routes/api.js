/** Routes for IEXCloud API calls */

const express = require("express");
const router = express.Router({ mergeParams: true });

const IexCloudApi = require("../helpers/iexCloudApi");


/** GET / => {stocks: [{"symbol"...}, ...]} */

router.get("/search/:query", async function(req, res, next) {
  try {
    const stocks = await IexCloudApi.search(req.params.query);
    return res.json({stocks});
  }

  catch (err) {
    return next(err);
  }
});

/** GET / => {stock: [{"name"...}, ...]} */

router.get("/stock/:ticker", async function(req, res, next) {
  try {
    const stock = await IexCloudApi.stockDetails(req.params.ticker);
    return res.json({stock});
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;