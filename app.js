/** Express app for stockX */


const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

// add logging system

const morgan = require("morgan");
app.use(morgan("tiny"));


const usersRoutes = require("./routes/users");
const listsRoutes = require("./routes/lists");
const stocksRoutes = require("./routes/stocks");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

app.use("/users", usersRoutes);
app.use("/lists", listsRoutes);
app.use("/stocks", stocksRoutes);
app.use("/api", apiRoutes);
app.use("/", authRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  if (err.stack) console.log(err.stack);

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
