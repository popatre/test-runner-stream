const express = require("express");
const {
    deleteByCommentId,
    getAllComments,
    updateVotesByCommentId,
} = require("../controllers/comments.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const commentsRouter = express.Router();

commentsRouter
    .route("/:comment_id")
    .delete(deleteByCommentId)
    .patch(updateVotesByCommentId)
    .all(methodNotAllowed);
commentsRouter.route("/").get(getAllComments);

module.exports = commentsRouter;
