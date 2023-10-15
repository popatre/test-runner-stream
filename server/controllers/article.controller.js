const {
    fetchArticleById,
    incrementVotesByID,
    incrementVotesById,
    fetchAllArticles,
    fetchArticleCommentsById,
    addCommentById,
    removeArticleById,
    addNewArticle,
} = require("../models/articles.model");

exports.getArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    console.log(article_id, "*******");
    try {
        const article = await fetchArticleById(article_id);
        res.status(200).send({ article });
    } catch (err) {
        next(err);
    }
};

exports.getAllArticles = async (req, res, next) => {
    const { sort_by, order, topic, limit, p } = req.query;
    try {
        const articles = await fetchAllArticles(
            sort_by,
            order,
            topic,
            limit,
            p
        );
        res.status(200).send({ articles });
    } catch (err) {
        next(err);
    }
};

exports.updateVotesById = async (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const reqLength = Object.keys(req.body).length;
    try {
        const article = await incrementVotesById(
            article_id,
            inc_votes,
            reqLength
        );
        res.status(200).send({ article });
    } catch (err) {
        next(err);
    }
};

exports.getArticleCommentsById = async (req, res, next) => {
    const { limit, p } = req.query;
    const { article_id } = req.params;
    try {
        const comments = await fetchArticleCommentsById(article_id, limit, p);

        res.status(200).send({ comments });
    } catch (err) {
        next(err);
    }
};

exports.postCommentById = async (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const reqLength = Object.keys(req.body).length;
    try {
        const comment = await addCommentById(
            article_id,
            username,
            body,
            reqLength
        );
        res.status(201).send({ comment });
    } catch (err) {
        next(err);
    }
};

exports.deleteArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    try {
        const deleted = await removeArticleById(article_id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

exports.postNewArticles = async (req, res, next) => {
    const { author, title, body, topic } = req.body;
    const reqLength = Object.keys(req.body).length;
    try {
        const article = await addNewArticle(
            title,
            topic,
            body,
            author,
            reqLength
        );
        res.status(201).send({ article });
    } catch (err) {
        next(err);
    }
};
