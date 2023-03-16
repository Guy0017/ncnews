const { findUsers, findUser } = require("../model/user.model");

exports.getUsers = (req, res, next) => {
  findUsers()
    .then((arrayOfUsers) => {
      res.status(200).send({ users: arrayOfUsers });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  findUser(req)
    .then((user) => { 
      res.status(200).send({ users: user });
    })
    .catch(next);
};
