const express = require("express");
const { methodNotAllowed } = require("../controllers/errors.controller");
const {
    getAllUsernames,
    getUsernameByName,
} = require("../controllers/users.controller");
const usersRouter = express.Router();

usersRouter.route("/").get(getAllUsernames).all(methodNotAllowed);
usersRouter.route("/:username").get(getUsernameByName).all(methodNotAllowed);

module.exports = usersRouter;
