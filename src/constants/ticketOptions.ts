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
    { ticketTestId: "all", body: "All tickets" },
    {
        ticketTestId: exports.ticketTestIds.getTopics,
        body: "#2 - GET /api/topics",
    },
    {
        ticketTestId: exports.ticketTestIds.articleById,
        body: "#4 - GET /api/articles/:article_id",
    },
    {
        ticketTestId: exports.ticketTestIds.allArticles,
        body: "#5 - GET /api/articles",
    },
    {
        ticketTestId: exports.ticketTestIds.articleComments,
        body: "#6 - GET /api/articles/:article_id/comments",
    },
    {
        ticketTestId: exports.ticketTestIds.postComment,
        body: "#7 - POST /api/articles/:article_id/comments",
    },
    {
        ticketTestId: exports.ticketTestIds.patchVotes,
        body: "#8 - PATCH /api/articles/:article_id",
    },
    {
        ticketTestId: exports.ticketTestIds.deleteComment,
        body: "#9 - DELETE /api/comments/:comment_id",
    },
    {
        ticketTestId: exports.ticketTestIds.getUsers,
        body: "#10 - GET /api/users",
    },
    {
        ticketTestId: exports.ticketTestIds.queries,
        body: "#11 - GET /api/articles(queries)",
    },
    {
        ticketTestId: exports.ticketTestIds.articleCC,
        body: "#12 - GET /api/articles/:article_id (comment_count)",
    },
];
