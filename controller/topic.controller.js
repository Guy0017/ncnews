const { findTopics, createTopic } = require("../model/topic.model");

exports.getTopics = (req, res, next) => {
  findTopics()
    .then((arrayOfTopics) => {
      res.status(200).send({ topics: arrayOfTopics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  createTopic(req)
    .then((createdTopic) => {
      res.status(201).send({ topics: createdTopic });
    })
    .catch(next);
};
