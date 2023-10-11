const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

const app = require("../app");

describe("/api", () => {
    test("status 404 - not a route/path ", () => {
        return request(app)
            .get("/api/badroute")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("invalid url");
            });
    });
    describe("GET/api/topics", () => {
        test("status:200 - responds with array of topics, with appropriate fields", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body;
                    expect(topics).toBeInstanceOf(Array);
                    expect(topics).toHaveLength(3);
                    topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String),
                        });
                    });
                });
        });
    });

    describe("GET/api/articles/:article_id", () => {
        test("status 200 - returns articles object correctly based on id ", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toBeInstanceOf(Object);
                    expect(article).toMatchObject({
                        title: "Living in the shadow of a great man",
                        author: "butter_bridge",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: 100,
                        comment_count: "11",
                    });
                });
        });
        test("status 404 - valid requests id that doesnt exist", () => {
            return request(app)
                .get("/api/articles/2000")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ message: "article not found" });
                });
        });
        test("status 400 - requests id that doesnt exist with string parameter/wrong data type", () => {
            return request(app)
                .get("/api/articles/doesntexist")
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ message: "invalid request" });
                });
        });
    });
    describe("PATCH/api/articles/:article_id", () => {
        test("status 200 - increments votes correctly and returns updated article ", () => {
            const update = { inc_votes: 10 };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 110,
                    });
                });
        });
        test("status 200 - decrements votes correctly and returns updated article ", () => {
            const update = { inc_votes: -10 };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toMatchObject({
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: expect.any(String),
                        votes: 90,
                    });
                });
        });
        test("status 400 - missing data from patch object  ", () => {
            const update = { inc_votes: "" };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - incorrect data type used to increment  ", () => {
            const update = { inc_votes: "string" };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid request");
                });
        });
        test("status 400 - mis-spelt key on patch object  ", () => {
            const update = { incvote: 10 };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - extra key on patch object  ", () => {
            const update = { inc_votes: 10, name: "mitch" };
            return request(app)
                .patch("/api/articles/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - invalid id in url  ", () => {
            const update = { inc_votes: 10 };
            return request(app)
                .patch("/api/articles/not-a-string")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid request");
                });
        });
        test("status 404 - valid id, not non-existing Id in database  ", () => {
            const update = { inc_votes: 10 };
            return request(app)
                .patch("/api/articles/9999")
                .send(update)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("article not found");
                });
        });
    });
    describe("GET/api/articles", () => {
        test("status 200 - responds with array of article objects, containing correct properties - length 10 by default ", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array);
                    expect(body.articles).toHaveLength(10);
                    body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - responds with array of article objects, containing correct properties - accepting limit query ", () => {
            return request(app)
                .get("/api/articles?limit=5")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array);
                    expect(body.articles).toHaveLength(5);
                    body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - responds with array of article objects, containing correct properties - accepting p query ", () => {
            return request(app)
                .get("/api/articles?p=2")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array);
                    expect(body.articles).toHaveLength(2);
                    body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - accepts both page and limit query, responding with correct length page and limit ", () => {
            return request(app)
                .get("/api/articles?limit=5&&p=3")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeInstanceOf(Array);
                    expect(body.articles).toHaveLength(2);
                    body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(String),
                        });
                    });
                });
        });
        test("status 400 - bad p query input ", () => {
            return request(app)
                .get("/api/articles?p=not-a-number")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid page query");
                });
        });
        test("status 400 - bad limit query - not a valid number", () => {
            return request(app)
                .get("/api/articles?limit=not-a-number")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid limit query");
                });
        });
        test("status 200 - returns articles sorted by date when no sorted param given ", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        descending: true,
                    });
                });
        });
        test("status 200 - returns articles sorted by column selected ", () => {
            return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("author", {
                        descending: true,
                    });
                });
        });
        test("status 400 - invalid sort query/not a column in db ", () => {
            return request(app)
                .get("/api/articles?sort_by=notacolumn")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid sort query");
                });
        });
        test("status 200 - orders db by ascending as default ", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        descending: true,
                    });
                });
        });
        test("status 200 - accepts order query ", () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", {
                        ascending: true,
                    });
                });
        });
        test("status 400 - invalid order query ", () => {
            return request(app)
                .get("/api/articles?order=notanorder")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid order query");
                });
        });
        test("status 200 - filters by topic query ", () => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(1);
                });
        });
        test("status 404 - tries to filter by topic that doesnt exist ", () => {
            return request(app)
                .get("/api/articles?topic=notatopic")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("topic not found");
                });
        });
        test("status 200 - queries existing topic, but with no articles associated ", () => {
            return request(app)
                .get("/api/articles?topic=paper")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toEqual([]);
                });
        });
    });
    describe("GET/api/articles/:article_id/comments", () => {
        test("status 200 - responds with an array of comment for the article requested - defaults to 10 results ", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                    expect(body.comments).toHaveLength(10);
                    body.comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - accepts limit query ", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=5")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                    expect(body.comments).toHaveLength(5);
                    body.comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - accepts p query and limit ", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=5&&p=3")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                    expect(body.comments).toHaveLength(1);
                    body.comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                        });
                    });
                });
        });
        test("status 200 - accepts p query ", () => {
            return request(app)
                .get("/api/articles/1/comments?p=2")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeInstanceOf(Array);
                    expect(body.comments).toHaveLength(1);
                    body.comments.forEach((comment) => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                        });
                    });
                });
        });
        test("status 400 - bad limit query/not a number ", () => {
            return request(app)
                .get("/api/articles/1/comments?limit=not-a-number")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid limit query");
                });
        });
        test("status 400 - bad page query/not a number ", () => {
            return request(app)
                .get("/api/articles/1/comments?p=not-a-number")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid page query");
                });
        });
        test("status 404 - requests comments from an article that does not exist ", () => {
            return request(app)
                .get("/api/articles/1000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("no comments found");
                });
        });
        test("status 200 - requests valid article, but does not have any comments associated ", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toEqual([]);
                });
        });
    });
    describe("POST/api/articles/:article_id/comments", () => {
        test("status 201 - successfully adds new comment with article id given, and returns posted comment ", () => {
            const commentInput = {
                username: "icellusedkars",
                body: "This is the new comment",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(201)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toMatchObject({
                        body: "This is the new comment",
                        votes: 0,
                        author: "icellusedkars",
                        article_id: 1,
                        created_at: expect.any(String),
                        comment_id: expect.any(Number),
                    });
                });
        });
        test("status 400 - missing values on post username ", () => {
            const commentInput = {
                username: "",
                body: "This is the new comment",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - missing values on post body ", () => {
            const commentInput = {
                username: "icellusedkars",
                body: "",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 404 - not an existing username on post body ", () => {
            const commentInput = {
                username: "notausername",
                body: "This is the test body",
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid content");
                });
        });
        test("status 400 - not valid data type in the body ", () => {
            const commentInput = {
                username: "icellusedkars",
                body: 12345,
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - more than expected content on the post request ", () => {
            const commentInput = {
                username: "icellusedkars",
                body: "this is the test body",
                votes: 100,
            };
            return request(app)
                .post("/api/articles/1/comments")
                .send(commentInput)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
    });
    describe("DELETE/api/comments/:comment_id", () => {
        test("Status 204 - no content after successful deletion by id ", () => {
            return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(() => {
                    return request(app)
                        .get("/api/comments")
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.comments).toHaveLength(10);
                        });
                });
        });
        test("Status 404 - request deleted of a comment id that doesnt exist ", () => {
            return request(app)
                .delete("/api/comments/10000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("comment not found");
                });
        });
        test("Status 400 - request id in wrong format ", () => {
            return request(app)
                .delete("/api/comments/wrongformat")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid request");
                });
        });
    });
    describe("GET/api", () => {
        test("status 200 - responds with JSON file with all available end points ", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                });
        });
    });
    describe("GET /api/users", () => {
        test("Status 200 - responds with an array of username objects ", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    users.forEach((username) => {
                        expect(username).toMatchObject({
                            username: expect.any(String),
                        });
                    });
                });
        });
    });
    describe("GET /api/users/:username", () => {
        test("status 200 - successfully responds with a username object, based on the username requested", () => {
            return request(app)
                .get("/api/users/lurker")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body;
                    expect(users).toMatchObject({
                        username: "lurker",
                        avatar_url:
                            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                        name: "do_nothing",
                    });
                });
        });
        test("status 404 - asked for data from a username that does not exist in the database", () => {
            return request(app)
                .get("/api/users/notausername")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid username");
                });
        });
        test("status 404 - username include capitalisation not found in the database", () => {
            return request(app)
                .get("/api/users/Lurker")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid username");
                });
        });
    });
    describe("PATCH /api/comments/:comment_id", () => {
        test("status 200 - increments votes correctly and returns updated comment ", () => {
            const update = { inc_votes: 10 };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 26,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: expect.any(String),
                    });
                });
        });
        test("status 200 - decrements votes correctly and returns updated comment ", () => {
            const update = { inc_votes: -6 };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 10,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: expect.any(String),
                    });
                });
        });
        test("status 200 - missing data on the patch object - returns unchanged comment", () => {
            const update = { inc_votes: "" };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 16,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: expect.any(String),
                    });
                });
        });
        test("status 400 - incorrect data type on patch object ", () => {
            const update = { inc_votes: "stringdata" };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid request");
                });
        });
        test("status 200 - misspelt key on patch object - returns unchanged comment ", () => {
            const update = { inc_vot: "10" };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(200)
                .then(({ body }) => {
                    const { comment } = body;
                    expect(comment).toMatchObject({
                        comment_id: 1,
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 16,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: expect.any(String),
                    });
                });
        });
        test("status 400 - extra key on patch object ", () => {
            const update = { inc_votes: 10, article_id: 10 };
            return request(app)
                .patch("/api/comments/1")
                .send(update)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 404 - patch to valid id, but doesnt exist in database ", () => {
            const update = { inc_votes: 10 };
            return request(app)
                .patch("/api/comments/10000")
                .send(update)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("comment not found");
                });
        });
    });
    describe("DELETE /api/articles/:article_id", () => {
        test("Status 204 - successfully deletes article by article id", () => {
            return request(app)
                .delete("/api/articles/1")
                .expect(204)
                .then(() => {
                    return request(app)
                        .get("/api/articles")
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.articles).toHaveLength(10);
                        });
                });
        });
        test("Status 404 - requests to delete article by id that doesnt exist", () => {
            return request(app)
                .delete("/api/articles/100000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("article not found");
                });
        });
        test("Status 400 - requests to delete article by invalid id", () => {
            return request(app)
                .delete("/api/articles/not-an-id")
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid request");
                });
        });
    });
    describe("POST /api/articles", () => {
        test("status 201 - responds with newly added article with the correct properties", () => {
            const input = {
                author: "icellusedkars",
                title: "my brand new post",
                body: "This is the body content",
                topic: "cats",
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(201)
                .then(({ body }) => {
                    expect(body.article).toMatchObject({
                        article_id: 13,
                        title: "my brand new post",
                        topic: "cats",
                        author: "icellusedkars",
                        votes: 0,
                        body: "This is the body content",
                        created_at: expect.any(String),
                        comment_count: "0",
                    });
                });
        });
        test("status 400 - missing data from post object ", () => {
            const input = {
                author: "icellusedkars",
                title: "",
                body: "This is the body content",
                topic: "cats",
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - missing keys from post object ", () => {
            const input = {
                author: "icellusedkars",

                body: "This is the body content",
                topic: "cats",
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - extra keys on the post object ", () => {
            const input = {
                author: "icellusedkars",
                title: "Title here",
                body: "This is the body content",
                topic: "cats",
                votes: 100,
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 404 - not existant username on post object ", () => {
            const input = {
                author: "notAUserName",
                title: "Title here",
                body: "This is the body content",
                topic: "cats",
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid username");
                });
        });
        test("status 404 - non existant topic on post object ", () => {
            const input = {
                author: "icellusedkars",
                title: "Title here",
                body: "This is the body content",
                topic: "NotATopic",
            };
            return request(app)
                .post("/api/articles")
                .send(input)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe("topic not found");
                });
        });
    });
    describe("POST /api/topics", () => {
        test("status 201 - accepts object and responds with topic object containing new topic", () => {
            const input = {
                slug: "New Topic",
                description: "This is the new description",
            };
            return request(app)
                .post("/api/topics")
                .send(input)
                .expect(201)
                .then(({ body }) => {
                    const { topic } = body;
                    expect(topic).toMatchObject({
                        slug: "New Topic",
                        description: "This is the new description",
                    });
                });
        });
        test("status 400 - missing data on post object", () => {
            const input = {
                slug: "",
                description: "This is the new description",
            };
            return request(app)
                .post("/api/topics")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - missing key/incorrect keys on post object", () => {
            const input = {
                slugsss: "New Topic",
                description: "This is the new description",
            };
            return request(app)
                .post("/api/topics")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - extra keys on post object", () => {
            const input = {
                slug: "New Topic",
                description: 99999,
                extraKey: "not allowed",
            };
            return request(app)
                .post("/api/topics")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
        test("status 400 - wrong data type on post object", () => {
            const input = {
                slug: "New Topic",
                description: 99999,
            };
            return request(app)
                .post("/api/topics")
                .send(input)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe("invalid input");
                });
        });
    });
    describe("Bad methods on existing routes", () => {
        describe("/api/topics", () => {
            test("status 405 - PATCH /api/topics", () => {
                const input = {
                    description: "new description",
                    slug: "mitch123",
                };
                return request(app)
                    .patch("/api/topics")
                    .send(input)
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
            test("status 406 - DELETE /api/topics", () => {
                return request(app)
                    .delete("/api/topics")
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
        });
        describe("/api/articles", () => {
            test("status 405 - PATCH ", () => {
                const input = {};
                return request(app)
                    .patch("/api/articles")
                    .send(input)
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
            test("status 405 - DELETE ", () => {
                return request(app)
                    .delete("/api/articles")
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
        });
        describe("/api/articles/:article_id", () => {
            test("status 405 -POST ", () => {
                const input = {};
                return request(app)
                    .post("/api/articles/1")
                    .send(input)
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
        });
        describe("/api/articles/:article_id/comments", () => {
            test("status 405 - DELETE ", () => {
                const input = {};
                return request(app)
                    .delete("/api/articles/1/comments")
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
            test("status 405 - PATCH", () => {
                const input = {};
                return request(app)
                    .patch("/api/articles/1/comments")
                    .send(input)
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.message).toBe("bad method on this route");
                    });
            });
        });
    });
});
