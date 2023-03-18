const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/topics", () => {
  test("returns status 200 for valid request", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("returns an object with a key describing the data. The value is an array of data objects containing the requested data", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const arrayOfObjects = body.topics;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayOfObjects)).toBe(true);
        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((dataObj) => {
          expect(dataObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each data object has the correct keys and value types", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const arrayOfTopics = body.topics;

        expect(arrayOfTopics.length).toBeGreaterThan(0);

        arrayOfTopics.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test('returns status 404 and "Not Found" for an invalid request', () => {
    return request(app)
      .get("/api/invalid_request")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns status 200 for valid request (article_id = 1)", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("returns object with a key describing the data. The value is an array containing the data object with the requested data for a valid request", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const arrayHoldingObj = body.articles;
        const dataObj = body.articles[0];

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
      });
  });
  test("data object contains correct keys and value types for a valid request", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test('returns status 400 and "Invalid Input" for not_an_ID', () => {
    return request(app)
      .get("/api/articles/not_an_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test('returns status 404 and "No Article With That ID" where article_id not in database', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article With That ID");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("returns status 200 for valid request", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app).patch("/api/articles/2").send(patch).expect(200);
  });
  test("returns an object with a key describing the data requested. The value is an array containing data object with data of the updated article", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        const arrayHoldingObj = body.articles;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(arrayHoldingObj[0]).toBeInstanceOf(Object);
      });
  });
  test("the updated object contains the correct keys and value types", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 1,
          })
        );
      });
  });
  test("votes are incremented by the request body", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            votes: 1,
          })
        );
      });
  });
  test("votes is decremented by the request body", () => {
    const patch = {
      inc_votes: -100,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            votes: -100,
          })
        );
      });
  });
  test("returns status 400 and 'Invalid Input' for malformed request body", () => {
    const patch = {};

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect value type", () => {
    const patch = {
      inc_votes: "notNumber",
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("GET /api/users", () => {
  test("returns status 200 for a valid request", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("returns an object with a key describing the data. The value is an array of data objects containing the requested data", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const arrayOfObj = body.users;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayOfObj)).toBe(true);
        expect(arrayOfObj.length).toBeGreaterThan(0);

        arrayOfObj.forEach((dataObj) => {
          expect(dataObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each data object contains the correct keys and string as their values", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const arrayOfObj = body.users;

        expect(arrayOfObj.length).toBeGreaterThan(0);

        arrayOfObj.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("return status 200 for a valid request", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("return object with key describing the data. The value is an array containing the data with comment count added to the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("return status 200 comment count of '0' where no comments exist", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("returns an object with a key describing the data. The value is an array of data objects containing the requested data", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayOfObjects)).toBe(true);
        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((dataObj) => {
          expect(dataObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each data object contains the correct keys and expected value types", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("the array of data objects is sorted by article creation date by default", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(arrayOfObjects).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns status 200 for valid request", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("returns object with a key describing the data. The value is an array of data objects containing the requested data", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const arrayOfComments = body.comments;

        expect(Array.isArray(arrayOfComments)).toBe(true);
        expect(arrayOfComments.length).toBeGreaterThan(0);
        expect(body).toBeInstanceOf(Object);

        arrayOfComments.forEach((dataObj) => {
          expect(dataObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each data object contains the correct keys and value types", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const arrayOfComments = body.comments;

        expect(arrayOfComments.length).toBeGreaterThan(0);

        arrayOfComments.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
            })
          );
        });
      });
  });
  test("return status 400 for 'not_an_id' as the article_id", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 404 and message of 'not found' for article_id that is not in database: article_id = 999", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id Not Found");
      });
  });
  test("returns status 200 and an empty array as the object's value where article_id exists in the database but there is no articles to return for that id: article_id = 2", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const emptyArray = body.comments;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(emptyArray)).toBe(true);
        expect(emptyArray.length).toBe(0);
        expect(emptyArray).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns status 201 for a valid post request", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201);
  });
  test("returns an object with a key describing the requested data. The value is an array containing the data object with the requested data", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .then(({ body }) => {
        const dataObj = body.comments[0];

        expect(Array.isArray(body.comments)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("the data object contains the correct keys and value types", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .then(({ body }) => {
        const dataObj = body.comments[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: input.body,
            article_id: 1,
            author: input.username,
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("returns status 400 and 'Invalid Input' for a malformed request body", () => {
    const input = {};

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect key in request body", () => {
    const input = {
      usname: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect value type in request body", () => {
    const input = {
      username: 2,
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for username that does not exist in users database", () => {
    const input = {
      username: "NOT A USER",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for an invalid article_id: 'not_an_id", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };
    return request(app)
      .post("/api/articles/not_an_id/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 404 and message 'Not Found' for article_id that does not exist in database: article_id = 999", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(input)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id Not Found");
      });
  });
});

describe("/api/articles (queries)", () => {
  test("returns data filtered by topic in default sort by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("returns data filter by topic in ascending order using default sortby date. Lowercase 'asc' query will work", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=asc")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("created_at", {
          descending: false,
        });

        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("returns data filtered by topic and sorted by article_id in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("article_id", {
          descending: false,
        });
        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("returns data filtered by topic and sorted by comment_count in ascending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=comment_count")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("comment_count", {
          descending: false,
        });
        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("returns status 400 and 'Bad Request: Invalid Order/Sortby Query' if invalid sortBy", () => {
    return request(app)
      .get("/api/articles?sortBy=INVALID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Order/Sortby Query");
      });
  });
  test("returns status 400 and 'Bad Request: Invalid Order/Sortby Query' if invalid order (not 'DESC' or 'ASC')", () => {
    return request(app)
      .get("/api/articles?order=INVALID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Order/Sortby Query");
      });
  });
  test("returns status 400 and 'Bad Request: Topic Does Not Exist' if topic does not exist in the articles or topics databases", () => {
    return request(app)
      .get("/api/articles?topic=DOESNOTEXIST")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Topic Does Not Exist");
      });
  });
  test("returns status 200 and returns empty array if topic exist in topics database but currently no articles with that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const emptyArray = body.articles;

        expect(emptyArray).toEqual([]);
        expect(emptyArray.length).toBe(0);
        expect(Array.isArray(emptyArray)).toBe(true);
      });
  });
  test("returns status 400 if 'sortBy' incorrectly spelt", () => {
    return request(app)
      .get("/api/articles?sortByy=article_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("returns status 400 if 'topic' incorrectly spelt", () => {
    return request(app)
      .get("/api/articles?topicc=paper")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("returns status 400 if 'order' incorrecly spelt", () => {
    return request(app)
      .get("/api/articles?orderr=paper")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("returns status 204 and no content for valid delete request", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("returns status 404 and message 'comment_id Not Found' for id that does not exist in the comments database", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id Not Found");
      });
  });
  test("returns status 400 and message 'Invalid Input' for invalid ID", () => {
    return request(app)
      .delete("/api/comments/INVALID_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("/api endpoints", () => {
  test("returns status 200 and all endpoints", () => {
    return request(app).get("/api").expect(200);
  });
});

describe("GET /api/users/:username", () => {
  test("returns status 200", () => {
    return request(app).get("/api/users/rogersop").expect(200);
  });
  test("returns object with a key describing the data. The value is an array containing the data object with the requested data for a valid request", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const arrayHoldingObj = body.users;
        const dataObj = body.users[0];

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
      });
  });
  test("data object contains correct keys and value types for a valid request", () => {
    return request(app)
      .get("/api/users/rogersop")
      .then(({ body }) => {
        const dataObj = body.users[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            name: "paul",
            username: "rogersop",
          })
        );
      });
  });
  test('returns status 404 and "User Not Found" for username that does not exist', () => {
    return request(app)
      .get("/api/users/invalidUsername")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("returns status 200 for valid request", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app).patch("/api/comments/1").send(patch).expect(200);
  });
  test("returns an object with a key describing the data requested. The value is an array containing data object with data of the updated comment", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .then(({ body }) => {
        const arrayHoldingObj = body.comments;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(arrayHoldingObj[0]).toBeInstanceOf(Object);
      });
  });
  test("the updated object contains the correct keys and value types", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.comments[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 17,
            created_at: "2020-04-06T12:17:00.000Z",
          })
        );
      });
  });
  test("votes are incremented by the request body", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.comments[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            votes: 17,
          })
        );
      });
  });
  test("votes are decremented by the request body", () => {
    const patch = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .then(({ body }) => {
        const dataObj = body.comments[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            votes: 15,
          })
        );
      });
  });
  test("returns status 400 and 'Invalid Input' for malformed request body", () => {
    const patch = {};

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect value type", () => {
    const patch = {
      inc_votes: "notNumber",
    };

    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("POST /api/articles", () => {
  test("returns status 200 for a valid request", () => {
    const input = {
      author: "icellusedkars",
      title: "POST /API/ARTICLES",
      body: "Success!",
      topic: "mitch",
    };

    return request(app).post("/api/articles").send(input).expect(201);
  });
  test("returns an object with a key describing the requested data. The value is an array containing the data object with the requested data", () => {
    const input = {
      author: "icellusedkars",
      title: "POST /API/ARTICLES",
      body: "Success!",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(Array.isArray(body.articles)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("the data object contains the correct keys and value types and returns correct uploaded article", () => {
    const input = {
      author: "icellusedkars",
      title: "POST /API/ARTICLES",
      body: "Success!",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        const dataObj = body.articles[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            article_id: 13,
            title: "POST /API/ARTICLES",
            topic: "mitch",
            author: "icellusedkars",
            body: "Success!",
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
          })
        );

        expect(Array.isArray(body.articles)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("returns status 400 and 'Invalid Input' for a malformed request body", () => {
    const input = {};

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect key in request body", () => {
    const input = { invalid: "invalid" };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect value type in request body", () => {
    const input = {
      author: 2,
      title: 2,
      body: 2,
      topic: 2,
    };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for username that does not exist in users database", () => {
    const input = {
      author: "invalidUser",
      title: "POST /API/ARTICLES",
      body: "Success!",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for topic that does not exist in topics database", () => {
    const input = {
      author: "icellusedkars",
      title: "POST /API/ARTICLES",
      body: "Success!",
      topic: "invalid",
    };

    return request(app)
      .post("/api/articles")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("Pagination for GET /api/articles", () => {
  test("queries with 'limit' and 'p' used to calculate pagination", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=3&&p=1"
      )
      .expect(200)
      .then(({ body }) => {
        const numberOfArticles = body.articles.length;

        expect(numberOfArticles).toBe(3);
      });
  });
  test("default limit is 10", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&p=1")
      .then(({ body }) => {
        const numberOfArticles = body.articles.length;

        expect(numberOfArticles).toBe(10);
      });
  });
  test("responds to page numbers", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=3&&p=2"
      )
      .then(({ body }) => {
        const arrayOfObj = body.articles;
        const page2Titles = ["Student SUES Mitch!", "A", "Z"];
        let isCorrect = true;

        expect(arrayOfObj.length).toBe(3);

        arrayOfObj.forEach((obj) => {
          if (!page2Titles.includes(obj.title)) {
            isCorrect = false;
          }
        });

        expect(isCorrect).toBe(true);
      });
  });
  test("responds correctly on page 2 where results is less than limit", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=10&&p=2"
      )
      .then(({ body }) => {
        const arrayOfObj = body.articles;

        expect(arrayOfObj.length).toBe(1);
      });
  });
  test("default p value is 0", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id")
      .then(({ body }) => {
        const numberOfArticles = body.articles.length;
        const firstArticleTitle = body.articles[0].title;
        const correctFirstTitle = "Living in the shadow of a great man";

        expect(numberOfArticles).toBe(10);
        expect(firstArticleTitle).toBe(correctFirstTitle);
      });
  });
  test("error 404 message when value of p exceeds number of database items", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=10&&p=5"
      )
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("error 400 message when p is negative number", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=10&&p=-1"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when p is a string", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=10&&p=NOTNUMBER"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when p is NaN", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=10&&p=NaN"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is a string", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=NOTNUMBER"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is negative number", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=-20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is 0", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is NaN", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id&&limit=NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("returns correctly with no topic and defaults in query", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const numberOfArticles = body.articles.length;

        expect(numberOfArticles).toBe(10);
      });
  });
  test("response contains total_count property", () => {
    return request(app)
      .get("/api/articles?limit=100")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        arrayOfArticles.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              total_count: 12,
            })
          );
        });
      });
  });
});

describe("Pagination for /api/articles/:article_id/comments", () => {
  test("queries with 'limit' and 'p' used to calculate pagination", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&&p=1")
      .expect(200)
      .then(({ body }) => {
        const numberOfComments = body.comments.length;

        expect(numberOfComments).toBe(3);
      });
  });
  test("default limit is 10", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=1")
      .then(({ body }) => {
        const numberOfComments = body.comments.length;

        expect(numberOfComments).toBe(10);
      });
  });
  test("responds to page numbers", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=3&&p=2")
      .then(({ body }) => {
        const arrayOfObj = body.comments;
        const page2Comments = [
          "I hate streaming noses",
          "I hate streaming eyes even more",
          "Lobster pot",
        ];
        let isCorrect = true;

        expect(arrayOfObj.length).toBe(3);

        arrayOfObj.forEach((obj) => {
          if (!page2Comments.includes(obj.body)) {
            isCorrect = false;
          }
        });

        expect(isCorrect).toBe(true);
      });
  });
  test("responds correctly on page 2 where results is less than limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=2")
      .then(({ body }) => {
        const arrayOfObj = body.comments;

        expect(arrayOfObj.length).toBe(1);
      });
  });
  test("default p value is 0", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const numberOfComments = body.comments.length;
        const firstComment = body.comments[0].body;
        const correctFirstComment =
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.";

        expect(numberOfComments).toBe(10);
        expect(firstComment).toBe(correctFirstComment);
      });
  });
  test("error 404 message when value of p exceeds number of database items", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=5")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("error 400 message when p is negative number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=-1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when p is a string", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=NOTNUMBER")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when p is NaN", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is a string", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=NOTNUMBER")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is negative number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=-20")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is 0", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=0")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("error 400 message when limit is NaN", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Query");
      });
  });
  test("response contains total_count property", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=100")
      .then(({ body }) => {
        const arrayOfComments = body.comments;

        arrayOfComments.forEach((dataObj) => {
          expect(dataObj).toEqual(
            expect.objectContaining({
              total_count: 11,
            })
          );
        });
      });
  });
});

describe("POST /api/topics", () => {
  test("returns status 201 for a valid post request", () => {
    const input = {
      slug: "topic name here",
      description: "description here",
    };

    return request(app).post("/api/topics").send(input).expect(201);
  });
  test("returns an object with a key describing the requested data. The value is an array containing the data object with the requested data", () => {
    const input = {
      slug: "topic name here",
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(input)
      .then(({ body }) => {
        const dataObj = body.topics[0];

        expect(Array.isArray(body.topics)).toBe(true);
        expect(dataObj).toBeInstanceOf(Object);
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("the data object contains the correct keys and value types", () => {
    const input = {
      slug: "topic name here",
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(input)
      .then(({ body }) => {
        const dataObj = body.topics[0];

        expect(dataObj).toEqual(
          expect.objectContaining({
            slug: "topic name here",
            description: "description here",
          })
        );
      });
  });
  test("returns status 400 and 'Invalid Input' for a malformed request body", () => {
    const input = {};

    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect key in request body", () => {
    const input = {
      INVALID: "topic name here",
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for incorrect value type in request body", () => {
    const input = {
      slug: 2,
      description: 2,
    };

    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("returns status 400 and 'Invalid Input' for slug that already exists in topics database", () => {
    const input = {
      slug: "mitch",
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});
