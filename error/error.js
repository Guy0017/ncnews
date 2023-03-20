exports.handleCustomError = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlError = (err, req, res, next) => {
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
};

exports.handleServerError = (err, req, res, next) => {
  console.log(err, "Unhandled Error");
  res.status(500).send({ msg: "Internal Server Error" });
};
