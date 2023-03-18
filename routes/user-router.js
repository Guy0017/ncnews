const { getUsers, getUser } = require("../controller/user.controller");

const userRouter = require("express").Router();

userRouter
    .route("/")
    .get(getUsers);

userRouter
    .route("/:username")
    .get(getUser);

module.exports = userRouter;
