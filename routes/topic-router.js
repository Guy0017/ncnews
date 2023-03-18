const { getTopics, postTopic } = require("../controller/topic.controller");

const topicRouter = require("express").Router();

topicRouter.route("/")
    .get(getTopics)
    .post(postTopic);

module.exports = topicRouter;
