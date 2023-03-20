const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");
const {
  handleCustomError,
  handlePsqlError,
  handleServerError,
} = require("./error/error.js");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomError);
app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;
