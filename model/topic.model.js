const db = require("../db/connection");

exports.findTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows: arrayOfTopics }) => {
    return arrayOfTopics;
  });
};

exports.createTopic = (req) => {
  const { slug, description } = req.body;

  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid Input" });
  }

  return db
    .query(
      "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;",
      [slug, description]
    )
    .then(({ rows: createdTopic }) => {
      return createdTopic;
    });
};
