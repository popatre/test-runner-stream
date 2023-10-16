const db = require("../db/connection");
const { fetchTopicBySlug } = require("./topics.model");
const { fetchUsernameByName } = require("./users.model");

exports.fetchArticleById = async (id) => {
    const { rows } = await db.query(
        `SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM articles 
        LEFT JOIN comments
        ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
        ;`,
        [id]
    );
    if (rows.length === 0) {
        const articleRes = await db.query(
            `SELECT * FROM articles WHERE article_id = $1;`,
            [id]
        );
        if (articleRes.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article not found" });
        }
    }
    return rows[0];
};

exports.fetchAllArticles = async (
    sort_by = "created_at",
    order = "desc",
    topic,
    limit = 10,
    p = 1
) => {
    const offset = (p - 1) * limit;
    if (
        ![
            "title",
            "topic",
            "author",
            "body",
            "created_at",
            "votes",
            "comment_count",
        ].includes(sort_by)
    ) {
        return Promise.reject({ status: 400, msg: "invalid sort query" });
    }
    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "invalid order query" });
    }
    if (isNaN(limit)) {
        return Promise.reject({ status: 400, msg: "invalid limit query" });
    }
    if (isNaN(offset)) {
        return Promise.reject({ status: 400, msg: "invalid page query" });
    }

    let queryStr = `SELECT articles.*, COUNT (comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `;

    const topicArr = [];
    if (topic) {
        const topicExist = await db.query(
            `SELECT * FROM topics WHERE slug = $1;`,
            [topic]
        );
        if (topicExist.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "topic not found" });
        }
        topicArr.push(topic);
        queryStr += `WHERE topic = $1 `;
    }

    queryStr += `GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}  `;

    const { rows } = await db.query(queryStr, topicArr);

    if (rows.length === 0) {
        const topicRes = await db.query(
            `SELECT * FROM topics WHERE slug = $1;`,
            [topic]
        );
        if (topicRes.rows.length === 0) {
            return Promise.reject({ status: 400, msg: "invalid input" });
        }
    }

    return rows;
};

exports.incrementVotesById = async (id, increment, reqLength) => {
    if (increment === undefined || increment.length === 0 || reqLength > 1) {
        return Promise.reject({ status: 400, msg: "invalid input" });
    }

    const { rows } = await db.query(
        `UPDATE articles 
        SET votes = votes + $1
        WHERE article_id = $2 RETURNING *;`,
        [increment, id]
    );

    if (rows.length === 0) {
        const articalRes = await db.query(
            `SELECT * FROM articles WHERE article_id = $1;`,
            [id]
        );
        if (articalRes.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "article not found" });
        }
    }

    return rows[0];
};

exports.fetchArticleCommentsById = async (id, limit = 10, p = 1) => {
    const offset = (p - 1) * limit;

    if (isNaN(limit)) {
        return Promise.reject({ status: 400, msg: "invalid limit query" });
    }
    if (isNaN(p)) {
        return Promise.reject({ status: 400, msg: "invalid page query" });
    }

    const { rows } = await db.query(
        "SELECT * FROM comments WHERE article_id = $1 LIMIT $2 OFFSET $3;",
        [id, limit, offset]
    );
    if (rows.length === 0) {
        const commentRes = await db.query(
            `SELECT * FROM articles WHERE article_id = $1;`,
            [id]
        );
        if (commentRes.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "no comments found" });
        }
    }

    return rows;
};

exports.addCommentById = async (id, username, body, reqLength) => {
    if (username === undefined || username.length === 0 || reqLength > 2) {
        return Promise.reject({ status: 400, msg: "invalid input" });
    }
    if (body === undefined || body.length === 0 || typeof body !== "string") {
        return Promise.reject({ status: 400, msg: "invalid input" });
    }
    const { rows } = await db.query(
        `INSERT INTO comments(body, author, article_id) 
    VALUES ($1, $2, $3) RETURNING *;`,
        [body, username, id]
    );
    if (rows.length === 0) {
        const userQuery = await db.query(
            `SELECT * FROM USERS WHERE username = $1;`,
            [username]
        );

        if (userQuery.length === 0) {
            return Promise.reject({ status: 404, msg: "username not found" });
        }
    }
    return rows[0];
};

exports.removeArticleById = async (id) => {
    const noArticle = await db.query(
        "SELECT * FROM comments WHERE article_id = $1;",
        [id]
    );
    if (noArticle.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
    }

    const deleted = await db.query(
        `DELETE FROM articles WHERE article_id = $1;`,
        [id]
    );
    return deleted;
};

exports.addNewArticle = async (title, topic, body, author, reqLength) => {
    if (
        title === undefined ||
        title.length === 0 ||
        topic === undefined ||
        topic.length === 0 ||
        body === undefined ||
        body.length === 0 ||
        author === undefined ||
        author.length === 0 ||
        reqLength > 4
    ) {
        return Promise.reject({ status: 400, msg: "invalid input" });
    }

    const validUser = await fetchUsernameByName(author);
    const validTopic = await fetchTopicBySlug(topic);

    const { rows } = await db.query(
        `INSERT INTO articles (title, topic, body, author)
        VALUES ($1, $2, $3, $4) RETURNING article_id;`,
        [title, topic, body, author]
    );
    const articleId = rows[0].article_id;

    const article = await exports.fetchArticleById(articleId);
    return article;
};
