const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "42703" ||
    err.code === "23503" ||
    err.code === "23505"
  ) {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});
app.use((err, req, res, next) => {
  console.log(err, "Unhandled Error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
