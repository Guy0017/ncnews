const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");


afterAll(() => db.end());
beforeEach(() => seed(data));

describe("GET /api/topics", () => {
  test("responds with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test('responds with status 404 and "Not Found" to an invalid request', () => {
    return request(app)
      .get("/api/invalid_request")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);

        expect(body.length).toBeGreaterThan(0);

        body.forEach((itemObj) => {
          expect(itemObj).toBeInstanceOf(Object);
        });
      });
  });
  test('each object has keys: "slug" and "description" and both have string as their value', () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);

        body.forEach((itemObj) => {
          expect(itemObj).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with 200 for valid request article_id 1", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("responds object with description as key and array containing an object with information for valid request where article_id 1", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const arrayHoldingObj = body.article;
        const infoObj = body.article[0];

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayHoldingObj)).toBe(true);
        expect(infoObj).toBeInstanceOf(Object);
      });
  });
  test("object holding information has right keys and values for a valid request", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
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
  test('status: 400 and "Invalid Input" for not an ID', () => {
    return request(app)
      .get("/api/articles/not_an_ID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test('status: 404 and "No Article With That ID" for valid ID but data does not exist', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No Article With That ID");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("responds with status 200", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app).patch("/api/articles/2").send(patch).expect(200);
  });
  test("responds with updated object with key describing the data and the updated object article its value", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.updatedArticle).toBeInstanceOf(Object);
      });
  });
  test("the updated object contains the correct keys and information type, with the votes incremented by the request body", () => {
    const patch = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual(
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
  test("votes is decremented by the request body", () => {
    const patch = {
      inc_votes: -100,
    };

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual(
          expect.objectContaining({
            votes: -100,
          })
        );
      });
  });
  test("status: 400 and 'Invalid Input' for malformed request body", () => {
    const patch = {};

    return request(app)
      .patch("/api/articles/2")
      .send(patch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status: 400 and 'Invalid Input' for incorrect value type", () => {
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
  test("responds with status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("responds with an array of objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.usersArray;
        expect(Array.isArray(usersArray)).toBe(true);

        expect(usersArray.length).toBeGreaterThan(0);

        usersArray.forEach((itemObj) => {
          expect(itemObj).toBeInstanceOf(Object);
        });
      });
  });
  test('each object has keys: "username", "name" and "avatar_url" and all have string as their value', () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.usersArray;
        expect(usersArray.length).toBeGreaterThan(0);

        usersArray.forEach((itemObj) => {
          expect(itemObj).toEqual(
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
  test("status: 200 and added comment to article response object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
          expect.objectContaining({
            comment_count: expect.any(Number),
          })
        );
      });
  });

  test("status: 200, response where article has no corresponding comment should show count to be 0", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const [infoObj] = body.article;

        expect(infoObj).toEqual(
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
  test("response is an object with key as description and value of an object of array holding of objects holding data requested", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(body).toBeInstanceOf(Object);
        expect(Array.isArray(arrayOfObjects)).toBe(true);
        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((infoObj) => {
          expect(infoObj).toBeInstanceOf(Object);
        });
      });
  });
  test("each object within the array contains the correct keys and expected value types", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(arrayOfObjects.length).toBeGreaterThan(0);

        arrayOfObjects.forEach((infoObj) => {
          expect(infoObj).toEqual(
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
  test("the array of objects is sorted by article creation date by default", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const arrayOfObjects = body.articles;

        expect(arrayOfObjects).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 for valid request", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("returns object with key as description and value is an array of objects containing requested data", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const arrayOfComments = body.comments;

        expect(Array.isArray(arrayOfComments)).toBe(true);
        expect(arrayOfComments.length).toBeGreaterThan(0);
        expect(body).toBeInstanceOf(Object);

        arrayOfComments.forEach((infoObj) => {
          expect(infoObj).toBeInstanceOf(Object);
        });
      });
  });

  test("each object in the array contains the correct key and value type", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const arrayOfComments = body.comments;

        expect(arrayOfComments.length).toBeGreaterThan(0);

        arrayOfComments.forEach((infoObj) => {
          expect(infoObj).toEqual(
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
  test("status: 400 for invalid article_id of 'not_an_id", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status: 404, 'not found' for article_id that is valid but does not exists in database: article_id = 999", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id Not Found");
      });
  });
  test("article_id that exists in database but there is no data: article_id = 2. Expect user to be sent empty array", () => {
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
  test("status: 201 for valid post", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(201);
  });
  test("returns uploaded post wrapped in a object with a description as it's key and uploaded post as it's value. Value is an object", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .then(({ body }) => {
        const infoObj = body.comments;

        expect(infoObj).toBeInstanceOf(Object);
        expect(body).toBeInstanceOf(Object);
      });
  });
  test("the object contains the correct keys and value type", () => {
    const input = {
      username: "icellusedkars",
      body: "Coding is like dreaming...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .then(({ body }) => {
        const infoObj = body.comments;

        expect(infoObj).toEqual(
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
  test("status: 400 and 'Invalid Input' for malformed request object", () => {
    const input = {};

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status: 400 and 'Invalid Input' for incorrect key in request object", () => {
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
  test("status: 400 and 'Invalid Input' for incorrect value type in request object", () => {
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
  test("status: 400 and 'Invalid Input' for username that does not appear in users database", () => {
    const input = {
      username: "NOT A USER",
      body: "NOT A USER",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(input)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status: 400 for invalid article_id of 'not_an_id", () => {
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
  test("status: 404, 'not found' for article_id that is valid but does not exists in database: article_id = 999", () => {
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
  test("filter topic and default to sort by date in descending order", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;
        
        expect(arrayOfArticles).toBeSortedBy("created_at", {
          descending: true,
        });

        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((infoObj) => {
          expect(infoObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("filter topic in by ascending order using default sortby date. Lowercase 'asc' query will work", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=asc")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("created_at", {
          descending: false,
        });

        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((infoObj) => {
          expect(infoObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });

  test("sort by filter topic in ascending order by article id", () => {
    return request(app)
      .get("/api/articles?topic=mitch&&order=ASC&&sortBy=article_id")
      .then(({ body }) => {
        const arrayOfArticles = body.articles;

        expect(arrayOfArticles).toBeSortedBy("article_id", {
          descending: false,
        });

        expect(arrayOfArticles.length).toBeGreaterThan(0);

        arrayOfArticles.forEach((infoObj) => {
          expect(infoObj).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("status: 400 and 'Bad Request: Invalid Order/Sortby Query' if invalid sortBy", () => {
    return request(app)
      .get("/api/articles?sortBy=INVALID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Order/Sortby Query");
      });
  });
  test("status: 400 and 'Bad Request: Invalid Order/Sortby Query' if invalid order (not 'DESC' or 'ASC')", () => {
    return request(app)
      .get("/api/articles?order=INVALID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid Order/Sortby Query");
      });
  });
  test("status: 400 and 'Bad Request: Topic Does Not Exist' if topic does not exist on article and topics database", () => {
    return request(app)
      .get("/api/articles?topic=DOESNOTEXIST")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Topic Does Not Exist");
      });
  });
  test("status: 200 and returns empty array if topic exist in topics database but currently no articles with that topic", () => {
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
  test("status: 400 'sortBy' incorrectly spelt", () => {
    return request(app)
      .get("/api/articles?sortByy=article_id")
      .expect(400)
      .then(({ body }) => {

        expect(body.msg).toBe('Bad Request: Invalid Query');
    
      });
  });
  test("status: 400 'topic' incorrectly spelt", () => {
    return request(app)
      .get("/api/articles?topicc=paper")
      .expect(400)
      .then(({ body }) => {

        expect(body.msg).toBe('Bad Request: Invalid Query');

      });
  });
  test("status: 400 'order' incorrecly spelt", () => {
    return request(app)
      .get("/api/articles?orderr=paper")
      .expect(400)
      .then(({ body }) => {

        expect(body.msg).toBe('Bad Request: Invalid Query');

      });
  });
});