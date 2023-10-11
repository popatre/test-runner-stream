const db = require("../connection");

const format = require("pg-format");

const seed = (data) => {
    const { articleData, commentData, topicData, userData } = data;
    return db
        .query(`DROP TABLE IF EXISTS comments;`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS articles;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS users;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS topics;`);
        })
        .then(() => {
            return db.query(`
                        CREATE TABLE topics(
                        slug VARCHAR PRIMARY KEY,
                        description VARCHAR);
                `);
        })
        .then(() => {
            return db.query(`
                        CREATE TABLE users(
                        username VARCHAR PRIMARY KEY NOT NULL,
                        avatar_url VARCHAR,
                        name VARCHAR NOT NULL);
                  `);
        })
        .then(() => {
            return db.query(`CREATE TABLE articles(
                    article_id SERIAL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    body VARCHAR NOT NULL,
                    votes INT DEFAULT 0,
                    topic VARCHAR REFERENCES topics(slug) NOT NULL,
                    author VARCHAR REFERENCES users(username) NOT NULL,
                    created_at VARCHAR DEFAULT CURRENT_TIMESTAMP
                  );`);
        })
        .then(() => {
            return db.query(`CREATE TABLE comments(
                    comment_id SERIAL PRIMARY KEY,
                    author VARCHAR REFERENCES users(username) NOT NULL,
                    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL,
                    created_at VARCHAR DEFAULT CURRENT_TIMESTAMP,
                    body VARCHAR NOT NULL,
                    votes INT DEFAULT 0
                  );`);
        })
        .then(() => {
            const queryTopics = format(
                `INSERT INTO topics (slug, description)
                        VALUES %L;`,
                topicData.map((topics) => {
                    return [topics.slug, topics.description];
                })
            );
            return db.query(queryTopics);
        })
        .then(() => {
            const queryUsers = format(
                `
          INSERT INTO users (username, avatar_url, name)
          VALUES %L;`,
                userData.map((user) => {
                    return [user.username, user.avatar_url, user.name];
                })
            );
            return db.query(queryUsers);
        })
        .then(() => {
            const queryArticles = format(
                `
          INSERT INTO articles (title, topic, author, body, created_at, votes) 
          VALUES %L;`,
                articleData.map((article) => {
                    return [
                        article.title,
                        article.topic,
                        article.author,
                        article.body,
                        article.created_at,
                        article.votes,
                    ];
                })
            );
            return db.query(queryArticles);
        })
        .then(() => {
            const queryComments = format(
                `
          INSERT INTO comments(body, votes, author, article_id, created_at) 
          VALUES %L;`,
                commentData.map((comment) => {
                    return [
                        comment.body,
                        comment.votes,
                        comment.author,
                        comment.article_id,
                        comment.created_at,
                    ];
                })
            );
            return db.query(queryComments);
        });
};

module.exports = seed;
