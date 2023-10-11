// https://github.com/nearform/node-test-parser#node-test-parser
process.env.PGDATABASE = "nc_news_test";

const { test: tester, describe, beforeEach, afterAll } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const db = require("../../server/db/connection");

const app = require("../../server/app");

const testData = require("../../server/db/data/test-data/index");
const seed = require("../../server/db/seeds/seed");

beforeEach(() => seed(testData));
// afterAll(() => db.end());

tester("status 404 - not a route/path", async () => {
    const { body } = await request(app).get("/api/badroute").expect(404);
    // console.log(response, "*****");
    const expected = "invalid url";

    assert.equal(body.message, expected);
});

tester(
    "status 200 - returns articles object correctly based on id ",
    async () => {
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
    }
);
