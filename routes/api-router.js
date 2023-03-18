const apiRouter = require("express").Router();
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const endpointRouter = require("./endpoint-router");
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/", endpointRouter);

module.exports = apiRouter;
