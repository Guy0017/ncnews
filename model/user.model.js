const db = require("../db/connection");

exports.findUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: arrayOfUsers }) => {
    return arrayOfUsers;
  });
};
