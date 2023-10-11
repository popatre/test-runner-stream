const {
    removeCommentById,
    fetchAllComments,
    addVotesByCommentId,
} = require("../models/comments.model");

exports.deleteByCommentId = async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const deleted = await removeCommentById(comment_id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

exports.getAllComments = async (req, res, next) => {
    const { limit, p } = req.query;
    try {
        const comments = await fetchAllComments(limit, p);
        res.status(200).send({ comments });
    } catch (err) {
        next(err);
    }
};

exports.updateVotesByCommentId = async (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const reqLength = Object.keys(req.body).length;

    addVotesByCommentId(comment_id, inc_votes, reqLength)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
};
