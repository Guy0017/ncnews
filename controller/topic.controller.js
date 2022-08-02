const { findTopics } = require("../model/topic.model");

exports.getTopics = (req, res, next) => {
  findTopics()
    .then((arrayOfTopics) => {
      res.status(200).send(arrayOfTopics);
    })
    .catch(next);
};
