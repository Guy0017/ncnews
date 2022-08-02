const db = require("../db/connection");

exports.findTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: arrayOfTopics }) => {
    return arrayOfTopics;
  });
};
