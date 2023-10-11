const db = require("../db/connection");

exports.fetchAllTopics = async () => {
    const { rows } = await db.query("SELECT * FROM topics");
    return rows;
};

exports.addNewTopic = async (slug, description, reqLength) => {
    if (
        slug === undefined ||
        slug.length === 0 ||
        description === undefined ||
        description.length === 0 ||
        reqLength > 2 ||
        typeof description !== "string"
    ) {
        return Promise.reject({ status: 400, msg: "invalid input" });
    }
    const { rows } = await db.query(
        `INSERT INTO topics VALUES ($1, $2) RETURNING *;`,
        [slug, description]
    );
    return rows[0];
};

exports.fetchTopicBySlug = async (slug) => {
    const { rows } = await db.query(`SELECT * FROM topics WHERE slug = $1;`, [
        slug,
    ]);
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
    }
    return rows;
};
