const express = require("express");
const { endspoints } = require("../controllers/api.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const apiRouter = express.Router();

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.route("/").get(endspoints).all(methodNotAllowed);

module.exports = apiRouter;
