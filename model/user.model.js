const db = require("../db/connection");

exports.findUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: arrayOfUsers }) => {
    return arrayOfUsers;
  });
};

exports.findUser = (req) => {
  const { username } = req.params;

  return db
    .query("SELECT * FROM users WHERE username = $1;", [username])
    .then(({ rows: user }) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }

      return user;
    });
};
