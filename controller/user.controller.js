const { findUsers } = require("../model/user.model");

exports.getUsers = (req, res, next) => {
  findUsers()
    .then((usersArray) => {
      res.status(200).send(usersArray);
    })
    .catch(next);
};
