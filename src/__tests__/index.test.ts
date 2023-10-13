// https://github.com/nearform/node-test-parser#node-test-parser
process.env.PGDATABASE = "nc_news_test";

const { test, describe, beforeEach, afterAll } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const db = require("../../server/db/connection");

const app = require("../../server/app");

const testData = require("../../server/db/data/test-data/index");
const seed = require("../../server/db/seeds/seed");

beforeEach(() => seed(testData));
// afterAll(() => db.end());

// test("status 404 - not a route/path", async () => {
//     const { body } = await request(app).get("/api/badroute").expect(404);
//     // console.log(response, "*****");
//     const expected = "invalid url";

//     assert.equal(body.message, expected);
// });

test("200 - GET:/api/topics - respond with list of topics ", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    const expected = {
        slug: "mitch",
        description: "The man, the Mitch, the legend",
    };
    assert.deepStrictEqual(body.topics[0], expected);
    assert.equal(body.topics.length, 3);
});

test("200 - GET:/api/articles/:article_id - returns articles object correctly based on id ", async () => {
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

test("404 - GET:/api/articles/:article_id - return 404 for article not found", async () => {
    await request(app).get("/api/articles/1000000").expect(404);
});

test("400 - GET:/api/articles/:article_id - return 400 bad article id request", async () => {
    await request(app).get("/api/articles/not-an-id").expect(400);
});

test("200 - GET:/api/articles - should respond with articles array", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    const isArray = Array.isArray(body.articles);
    assert.equal(isArray, true);
});

test("200 - GET:/api/articles - should respond with all articles", async () => {
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

test("200 - GET:/api/articles - should not contain body property", async () => {
    const {
        body: { articles },
    } = await request(app).get("/api/articles").expect(200);

    assert.equal(articles.length > 0, true);

    for (const article of articles) {
        assert.equal(article.hasOwnProperty("body"), false);
    }
});
test("200 - GET:/api/articles - sorted by descending date", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    assert.equal(body.articles[0].article_id, 3);
});
