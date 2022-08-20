# News API

## About

This is a backend news API project. It is hosted at Heroku:

https://ncnews-guy.herokuapp.com/api/topics

It allows for the following functionality:

- GET requests for api, topics, users, articles
- GET requests for article (by article_id), comments (by article_id)
- PATCH requests to add or remove votes
- POST requests for posting comment (by article_id)
- DELETE requests to delete comment (by comment_id)

GET requests for articles will take queries: articles can be filtered by topic and sorted (ascending or decedending order) by a valid sortBy query.

## 1. Clone Repository

The code can be found at the following repository:

https://github.com/Guy0017/ncnews.git

Run the following terminal command:

```bash
$ git clone <code_url>
```

## 2. Code and Developer Package Dependencies

This backend was built using Node v18.3.0 and PostgreSQL v14.5 with the following code and developer package dependencies.

Code:

- dotenv: v16.0.0
- express: v4.18.1
- pg: v8.7.3
- pg-format: v1.0.4

Developer:

- husky: v7.0.0
- jest: v27.5.1
- jest-extended: v2.0.0
- jest-sorted: v1.0.14
- supertest: v6.2.4

After cloning this repository, run the following terminal command to install all these listed dependencies which appear in the package.json file:

```bash
$ npm install
```

Alternatively, install each npm packaged dependency individually with the following terminal commands.

Code:

```bash
$ npm install dotenv
$ npm install express
$ npm install pg
$ npm install pg-format
```

Developer:

```bash
$ npm install -D jest
$ npm install -D jest-sorted
$ npm install -D supertest
$ npm install -D husky (optional)
```

The package.json script may need modification if different versions are installed or if certain packages are omitted.

## 3. Create Database and Seeding

In accordance with good security practices, this repository will not contain the following files:

- .env.test
- .env.development

The .gitignore is configured to ignore both these files when pushing to git. Therefore, these files will only be available locally and will need to be created each time this repository is cloned. This is designed for data security.

Create the .env.test and .env.development files on the same level as the package.json. Configure each file with the corresponding test and development database names following the example:

```js
PGDATABASE=<database_name>
```

The database names are contained within "./db/setup.sql":

- nc_news_test (test database name)
- nc_news (development database name)

Run the following in the terminal to create the database and then seed:

```bash
$ npm run setup dbs
$ npm run seed
```

## 4. Tests

Tests are written with jest, jest-sorted and supertest. These are located in the "./__tests__/" folder. Run tests with the following terminal command:

```bash
$ npm test app.test.js
```
