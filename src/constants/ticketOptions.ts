exports.TICKET_TEST_IDS = {
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
        ticketTestId: exports.TICKET_TEST_IDS.getTopics,
        body: "#2 - GET /api/topics",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.articleById,
        body: "#4 - GET /api/articles/:article_id",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.allArticles,
        body: "#5 - GET /api/articles",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.articleComments,
        body: "#6 - GET /api/articles/:article_id/comments",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.postComment,
        body: "#7 - POST /api/articles/:article_id/comments",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.patchVotes,
        body: "#8 - PATCH /api/articles/:article_id",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.deleteComment,
        body: "#9 - DELETE /api/comments/:comment_id",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.getUsers,
        body: "#10 - GET /api/users",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.queries,
        body: "#11 - GET /api/articles(queries)",
    },
    {
        ticketTestId: exports.TICKET_TEST_IDS.articleCC,
        body: "#12 - GET /api/articles/:article_id (comment_count)",
    },
];
