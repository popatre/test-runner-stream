const express = require("express");
const {
    getAllTopics,
    postNewTopic,
} = require("../controllers/topics.controller");

const { methodNotAllowed } = require("../controllers/errors.controller");
const topicsRouter = express.Router();

topicsRouter
    .route("/")
    .get(getAllTopics)
    .post(postNewTopic)
    .all(methodNotAllowed);

module.exports = topicsRouter;
