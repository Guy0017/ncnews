const { getEndpoints } = require("../controller/endpoint.controller");

const endpointRouter = require("express").Router();

endpointRouter
    .route("/")
    .get(getEndpoints);

module.exports = endpointRouter;
