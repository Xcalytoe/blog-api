# Article API

A simple Article API built with Node.js, Express and MongoDB following the MVC pattern. The API supports user authentication with JWT, article creation, publishing, editing, deletion, listing and searching. It includes pagination, filtering, sorting and tests.

---

## Features

- User sign up and sign in (JWT authentication, tokens expire after 1 hour)
- Articles have two states: `draft` and `published`
- Public endpoints (no auth required):

  - Get a paginated list of published articles
  - Get a single published article (increments `read_count`)

- Authenticated endpoints (owner only for modifications):

  - Create an article (starts as `draft`)
  - Update an article (draft or published)
  - Publish an article (owner only)
  - Delete an article (owner only)
  - Get a list of the authenticated user's articles (paginated, filterable)

- Search by author, title and tags
- Orderable by `read_count`, `reading_time`, and `timestamp`
- Tests for all endpoints (Jest + Supertest)

---

## Tech stack

- Node.js
- Express
- MongoDB (mongoose)
- JWT for authentication
- Jest + Supertest for testing

---

## Environment variables

Create a `.env` file at the project root using the content of `.env.example`

---

```
API Endpoints
```

> All request and response examples below are illustrative. Replace `:id` or query params as needed.

### Auth

- `POST /api/v1/auth/signup`

  - body: `{ first_name, last_name, email, password }`
  - response: created user (no password) + token

- `POST /api/v1/auth/signin`

  - body: `{ email, password }`
  - response: `{ token, user }`

> Use the token in `Authorization: Bearer <token>` for protected routes.

### Articles

- `POST /api/v1/articles` (protected)

  - Create a new article. The article is created with `state: 'draft'`.
  - body: `{ title, description, tags, body }`

- `GET /api/v1/articles` (public)

  - Get paginated list of published articles (default `limit=20`)

  - Query params:

    - `page` (default 1)
    - `limit` (default 20)
    - `state` (optional - `draft|published`) — if provided and user is owner+auth, can return drafts
    - `search` (string) - will search `title`, `tags`, and author name/email
    - `author` (author id or name) - filter by author
    - `tags` (comma separated)
    - `sort` (e.g. `read_count`, `reading_time`, `timestamp`) — default `-createdAt` (newest first)

  - Example: `/api/v1/articles?page=2&limit=20&search=javascript&sort=read_count`

- `GET /api/v1/articles/:id` (public)

  - Returns a single article with author info embedded and increments `read_count` by 1.
  - If the article is `draft`, only the owner (authenticated) can access it.

- `PUT /api/v1/articles/:id` (protected — owner only)

  - Edit an article (draft or published). Partial updates allowed.

- `PATCH /api/v1/articles/:id/publish` (protected — owner only)

  - Update state to `published`.

- `DELETE /api/v1/articles/:id` (protected — owner only)

  - Delete an article.

- `GET /api/v1/users/me/articles` (protected)

  - Return paginated list of articles created by the authenticated user. Supports the same filters as the public list.

---
