/** Routes for IEXCloud API calls */

const express = require("express");
const router = express.Router({ mergeParams: true });

const IexCloudApi = require("../helpers/iexCloudApi");


/** GET / => {stocks: [{"symbol"...}, ...]} */

router.get("/search/:term", async function(req, res, next) {
  try {
    const stocks = await IexCloudApi.search(req.params.term);
    return res.json({stocks});
  }

  catch (err) {
    return next(err);
  }
});

module.exports = router;