const { findUsers } = require("../model/user.model");

exports.getUsers = (req, res, next) => {
  findUsers()
    .then((arrayOfUsers) => {
      res.status(200).send({ users: arrayOfUsers });
    })
    .catch(next);
};
