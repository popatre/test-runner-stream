process.env.PGDATABASE = "nc_news_test";

const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const testData = require("./test-server/db/data/test-data/index");

/* to connect to test database
const seed = require("./test-server/db/seeds/seed");
const db = require("./test-server/db/connection");
const app = require("./test-server/app");
*/

const seed = require("../evaluations/student/db/seeds/seed");
const db = require("../evaluations/student/db/connection");
const app = require("../evaluations/student/app");

beforeEach(() => seed(testData));

after(() => db.end());

test(`ticket-2: 404 - GET:/api/topics - not a route/path (could be done as part of any test)`, async () => {
    await request(app).get("/api/badroute").expect(404);
});

test("ticket-2: 200 - GET:/api/topics - respond with list of topics ", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    const expected = {
        slug: "mitch",
        description: "The man, the Mitch, the legend",
    };
    assert.deepStrictEqual(body.topics[0], expected);
    assert.equal(body.topics.length, 3);
});

test("ticket-4: 200 - GET:/api/articles/:article_id - returns articles object correctly based on id ", async () => {
    const {
        body: { article },
    } = await request(app).get("/api/articles/1").expect(200);

    const expected = {
        title: "Living in the shadow of a great man",
        author: "butter_bridge",
        article_id: 1,
        body: "I find this existence challenging",
        topic: "mitch",

        votes: 100,
    };
    assert.equal(article.title, expected.title);
    assert.equal(article.author, expected.author);
    assert.equal(article.article_id, expected.article_id);
    assert.equal(article.body, expected.body);
    assert.equal(article.topic, expected.topic);
    assert.equal(article.votes, expected.votes);
    assert.equal(article.topic, expected.topic);
});

test("ticket-4: 404 - GET:/api/articles/:article_id - return 404 for article not found", async () => {
    await request(app).get("/api/articles/1000000").expect(404);
});

test("ticket-4: 400 - GET:/api/articles/:article_id - return 400 bad article id request", async () => {
    await request(app).get("/api/articles/not-an-id").expect(400);
});

test("ticket-5: 200 - GET:/api/articles - should respond with articles array", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    const isArray = Array.isArray(body.articles);
    assert.equal(isArray, true);
});

test("ticket-5: 200 - GET:/api/articles - should respond with all articles", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    assert.equal(body.articles.length > 0, true);

    for (const article of body.articles) {
        assert.equal(article.hasOwnProperty("title"), true);
        assert.equal(article.hasOwnProperty("topic"), true);
        assert.equal(article.hasOwnProperty("author"), true);
        assert.equal(article.hasOwnProperty("created_at"), true);
        assert.equal(article.hasOwnProperty("votes"), true);
        assert.equal(article.hasOwnProperty("comment_count"), true);
        assert.equal(article.hasOwnProperty("article_id"), true);
    }
});

test("ticket-5: 200 - GET:/api/articles - should not contain body property", async () => {
    const {
        body: { articles },
    } = await request(app).get("/api/articles").expect(200);

    assert.equal(articles.length > 0, true);

    const error = new Error();
    error.name = "BODY KEY IS PRESENT";

    for (const article of articles) {
        assert.equal(article.hasOwnProperty("body"), false, error);
    }
});
test("ticket-5: 200 - GET:/api/articles - sorted by descending date", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    assert.equal(body.articles[0].article_id, 3);
});

test("ticket-6: 200 - GET:/api/articles/:article_id/comments - status 200", async () => {
    await request(app).get("/api/articles/1/comments").expect(200);
});

test("ticket-6: 200 - GET:/api/articles/:article_id/comments - should respond with comments arrays", async () => {
    const {
        body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);

    const isArray = Array.isArray(comments);
    assert.equal(isArray, true);
    assert.equal(comments.length > 0, true);
    for (const comment of comments) {
        assert.equal(comment.hasOwnProperty("comment_id"), true);
        assert.equal(comment.hasOwnProperty("votes"), true);
        assert.equal(comment.hasOwnProperty("created_at"), true);
        assert.equal(comment.hasOwnProperty("author"), true);
        assert.equal(comment.hasOwnProperty("body"), true);
    }
});

test("ticket-6: 200 - GET:/api/articles/:article_id/comments - serve an empty array when the article exists but has no comments", async () => {
    const {
        body: { comments },
    } = await request(app).get("/api/articles/2/comments").expect(200);
    const isArray = Array.isArray(comments);
    assert.equal(isArray, true);
    assert.equal(comments.length, 0);
});

test("ticket-6: 404 - GET:/api/articles/:article_id/comments - Not Found when given a valid `article_id` not in db", async () => {
    await request(app).get("/api/articles/999999/comments").expect(404);
});

test("ticket-6: 400 - GET:/api/articles/:article_id/comments - Bad Request when given an invalid `article_id`", async () => {
    await request(app).get("/api/articles/not-an-id/comments").expect(400);
});

test("ticket-7: 201 - POST:/api/articles/:article_id/comments - should post and respond with new comment", async () => {
    const postBody = { username: "butter_bridge", body: "this is a comment" };
    const articleId = 1;
    const {
        body: { comment },
    } = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(postBody)
        .expect(201);
    assert.equal(comment.hasOwnProperty("comment_id"), true);
    assert.equal(comment.hasOwnProperty("votes"), true);
    assert.equal(comment.hasOwnProperty("created_at"), true);
    assert.equal(comment.hasOwnProperty("author"), true);
    assert.equal(comment.hasOwnProperty("body"), true);

    assert.equal(comment.author, postBody.username);
    assert.equal(comment.body, postBody.body);
    assert.equal(comment.article_id, articleId);
    assert.equal(comment.votes, 0);
});

test("ticket-7: 404 - POST:/api/articles/:article_id/comments - username not found", async () => {
    const postBody = { username: "notUser", body: "this is a comment" };
    const articleId = 1;
    await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(postBody)
        .expect(404);
});

test("ticket-7: 404 - POST:/api/articles/:article_id/comments - article not found", async () => {
    const postBody = { username: "butter_bridge", body: "this is a comment" };
    const articleId = 99999;
    await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(postBody)
        .expect(404);
});

test("ticket-7: 400 - POST:/api/articles/:article_id/comments - invalid article id", async () => {
    const postBody = { username: "butter_bridge", body: "this is a comment" };
    const articleId = "not-an-id";
    await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(postBody)
        .expect(400);
});

test("ticket-7: 400 - POST:/api/articles/:article_id/comments - missing required field", async () => {
    const postBody = { username: "butter_bridge" };
    const articleId = "not-an-id";
    await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .send(postBody)
        .expect(400);
});

test("ticket-8: 200 - PATCH:/api/articles/:article_id - should increment votes and respond with article", async () => {
    const patchBody = { inc_votes: 1 };
    const articleId = 1;
    const {
        body: { article },
    } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody)
        .expect(200);

    assert.equal(article.votes, 101);
});

test("ticket-8: 200 - PATCH:/api/articles/:article_id - should decrement votes and respond with article", async () => {
    const patchBody = { inc_votes: -1 };
    const articleId = 1;
    const {
        body: { article },
    } = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody)
        .expect(200);

    assert.equal(article.votes, 99);
});

test("ticket-8: 404 - PATCH:/api/articles/:article_id - article not found", async () => {
    const patchBody = { inc_votes: 1 };
    const articleId = 99999;
    await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody)
        .expect(404);
});
test("ticket-8: 400 - PATCH:/api/articles/:article_id - invalid id", async () => {
    const patchBody = { inc_votes: 1 };
    const articleId = "not-an-id";
    await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody)
        .expect(400);
});

test("ticket-8: 400 - PATCH:/api/articles/:article_id - inc votes not an integer", async () => {
    const patchBody = { inc_votes: "hello" };
    const articleId = 1;
    await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody)
        .expect(400);
});

test("ticket-8: 200/400 - PATCH:/api/articles/:article_id - inc_votes key missing", async () => {
    const patchBody = { inc_vo: 1 };
    const articleId = 1;
    const response = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(patchBody);
    assert.equal(response.status === 400 || response.status === 200, true);
});

test("ticket-9: 204 - DELETE:/api/comments/:comment_id - should delete comment and responds with no content", async () => {
    await request(app).delete(`/api/comments/1`).expect(204);
});

test("ticket-9: 404 - DELETE:/api/comments/:comment_id - comment not found", async () => {
    await request(app).delete(`/api/comments/99999`).expect(404);
});

test("ticket-9: 400 - DELETE:/api/comments/:comment_id - invalid comment id", async () => {
    await request(app).delete(`/api/comments/not-an-id`).expect(400);
});

test("ticket-10: 200 - GET:/api/users - responds with array of users", async () => {
    const {
        body: { users },
    } = await request(app).get(`/api/users`).expect(200);

    const isArray = Array.isArray(users);
    const error0 = new Error();
    error0.name =
        "HAS NOT RETURNED ARRAY - OR HASNT USED CORRECT KEY ON OBJECT";
    assert.equal(isArray, true, error0);

    assert.equal(users.length, 4);

    for (const user of users) {
        const error2 = new Error();
        error2.name = "MISSING USERNAME";
        assert.equal(user.hasOwnProperty("username"), true, error2);
        const error3 = new Error();
        error3.name = "MISSING AVATAR URL";
        assert.equal(user.hasOwnProperty("avatar_url"), true, error3);
    }
});

test.skip("ticket-11: 200 - GET:/api/articles(queries) - accept a sort_by query", async () => {
    const {
        body: { articles },
    } = await request(app).get(`/api/articles?sort_by=author`).expect(200);

    assert.equal(articles[0].author, "rogersop");
    assert.equal(articles[1].author, "rogersop");
    assert.equal(articles[2].author, "rogersop");
});

test("ticket-11: 200 - GET:/api/articles(queries) - accept an `order` query", async () => {
    const {
        body: { articles },
    } = await request(app).get(`/api/articles?order=asc`).expect(200);

    assert.equal(articles[0].title, "Z");
});

test("ticket-11: 200 - GET:/api/articles(queries) - accept an `topic` query", async () => {
    const {
        body: { articles },
    } = await request(app).get(`/api/articles?topic=mitch`).expect(200);
    const error = new Error();
    error.name = "NOT ALL THE REQUESTED TOPIC";
    for (const { topic } of articles) {
        assert.equal(topic, "mitch", error);
    }
});

test("ticket-11: 200 - GET:/api/articles(queries) - valid topic with no articles", async () => {
    const {
        body: { articles },
    } = await request(app).get(`/api/articles?topic=paper`).expect(200);
    assert.equal(Array.isArray(articles), true);
    assert.equal(articles.length, 0);
});

test("ticket-11: 404 - GET:/api/articles(queries) - 404 when provided a non-existent topic", async () => {
    await request(app).get(`/api/articles?topic=not-a-topic`).expect(404);
});

test.skip("ticket-11: 400 - GET:/api/articles(queries) - 400 when passed invalid sort by column", async () => {
    await request(app).get(`/api/articles?sort_by=not-a-column`).expect(400);
});

test.skip("ticket-11: 400 - GET:/api/articles(queries) - 400 when passed invalid order", async () => {
    await request(app).get(`/api/articles?order=not-an-order`).expect(400);
});

test("ticket-12: 200 -  GET:/api/articles/:article_id(comment_count) - should have comment count", async () => {
    const {
        body: { article },
    } = await request(app).get(`/api/articles/1`).expect(200);
    assert.equal(+article.comment_count, 11);
});

test("ticket-12: 200 -  GET:/api/articles/:article_id(comment_count) - should have comment count even when there are no comments for article", async () => {
    const {
        body: { article },
    } = await request(app).get(`/api/articles/2`).expect(200);
    const error = new Error();
    error.name = "NO COMMENT COUNT - HAVE THEY JOINED CORRECTLY?";
    assert.equal(+article.comment_count, 0, error);
});
