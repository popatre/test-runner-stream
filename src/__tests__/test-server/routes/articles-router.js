const express = require("express");
const {
    getArticleById,
    updateVotesById,
    getAllArticles,
    getArticleCommentsById,
    postCommentById,
    deleteArticleById,
    postNewArticles,
} = require("../controllers/article.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const articleRouter = express.Router();

articleRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(updateVotesById)
    .delete(deleteArticleById)
    .all(methodNotAllowed);
articleRouter
    .route("/:article_id/comments")
    .get(getArticleCommentsById)
    .post(postCommentById)
    .all(methodNotAllowed);
articleRouter
    .route("/")
    .get(getAllArticles)
    .post(postNewArticles)
    .all(methodNotAllowed);

module.exports = articleRouter;
