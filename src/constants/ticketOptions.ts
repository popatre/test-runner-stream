exports.ticketTestIds = {
    getTopics: "topics",
    articleById: "artById",
    allArticles: "allArts",
    articleComments: "artComms",
    postComment: "postComm",
    patchVotes: "patchVotes",
    deleteComment: "delComm",
    getUsers: "getUsers",
    queries: "queries",
    articleCC: "articleCC",
};

exports.tickets = [
    { ticketValue: "all", body: "All tickets" },
    {
        ticketValue: exports.ticketTestIds.getTopics,
        body: "#2 - GET /api/topics",
    },
    {
        ticketValue: exports.ticketTestIds.articleById,
        body: "#4 - GET /api/articles/:article_id",
    },
    {
        ticketValue: exports.ticketTestIds.allArticles,
        body: "#5 - GET /api/articles",
    },
    {
        ticketValue: exports.ticketTestIds.articleComments,
        body: "#6 - GET /api/articles/:article_id/comments",
    },
    {
        ticketValue: exports.ticketTestIds.postComment,
        body: "#7 - POST /api/articles/:article_id/comments",
    },
    {
        ticketValue: exports.ticketTestIds.patchVotes,
        body: "#8 - PATCH /api/articles/:article_id",
    },
    {
        ticketValue: exports.ticketTestIds.deleteComment,
        body: "#9 - DELETE /api/comments/:comment_id",
    },
    {
        ticketValue: exports.ticketTestIds.getUsers,
        body: "#10 - GET /api/users",
    },
    {
        ticketValue: exports.ticketTestIds.queries,
        body: "#11 - GET /api/articles(queries)",
    },
    {
        ticketValue: exports.ticketTestIds.articleCC,
        body: "#12 - GET /api/articles/:article_id (comment_count)",
    },
];
// ticket id
