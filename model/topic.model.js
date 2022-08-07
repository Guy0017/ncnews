const db = require("../db/connection");

exports.findTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: arrayOfTopics }) => {
    return arrayOfTopics;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query("SELECT * FROM topics WHERE slug = $1", [topic])
    .then(({ rows: checkExist }) => {
      return checkExist;
    });
};
