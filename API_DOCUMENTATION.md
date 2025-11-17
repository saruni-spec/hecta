# Hecta CMS API Documentation

## Overview

Hecta CMS is built on **Payload CMS 3.0** which automatically provides **REST** and **GraphQL** APIs for all collections. This document covers how to fetch blogs, users, media, and other content.

---

## Prod_URL : `https://hecta-pi.vercel.app/`

## Base URLs

- **REST API**: `http://localhost:3000/api/{collection}`
- **GraphQL API**: `http://localhost:3000/api/graphql`
- **GraphQL Playground**: `http://localhost:3000/api/graphql-playground`

### Production

- **REST API**: `https://hecta-pi.vercel.app/api/{collection}`
- **GraphQL API**: `https://hecta-pi.vercel.app/api/graphql`

---

## Collections

The following collections are available:

1. **Posts** - Blog articles and content
2. **Users** - User accounts with authentication
3. **Media** - Uploaded images and files (stored on Cloudinary)

---

## 🔗 REST API Endpoints

### 1. Posts (Blogs)

#### Get All Posts

```http
GET /api/posts
```

**Query Parameters:**

- `limit` - Number of posts per page (default: 10)
- `page` - Page number (default: 1)
- `sort` - Sort field (e.g., `-publishedAt` for newest first)
- `where` - Filter conditions (JSON)

**Example Request:**

```bash
curl "http://localhost:3000/api/posts?limit=10&sort=-publishedAt"
```

**Example Response:**

```json
{
  "docs": [
    {
      "id": "abc123",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "text": "Blog content here..."
                }
              ]
            }
          ]
        }
      },
      "publishedAt": "2025-11-17T10:00:00Z",
      "createdAt": "2025-11-17T09:00:00Z",
      "updatedAt": "2025-11-17T10:00:00Z"
    }
  ],
  "totalDocs": 1,
  "limit": 10,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

#### Get Single Post by ID

```http
GET /api/posts/:id
```

**Example:**

```bash
curl "http://localhost:3000/api/posts/abc123"
```

#### Get Post by Slug

```http
GET /api/posts?where[slug][equals]=my-first-blog-post
```

**Example:**

```bash
curl "http://localhost:3000/api/posts?where[slug][equals]=my-first-blog-post"
```

**Response:**

```json
{
  "docs": [
    {
      "id": "abc123",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "content": {...},
      "publishedAt": "2025-11-17T10:00:00Z"
    }
  ]
}
```

#### Create a Post (Authenticated)

```http
POST /api/posts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Your blog content here..."
            }
          ]
        }
      ]
    }
  },
  "publishedAt": "2025-11-17T10:00:00Z"
}
```

#### Update a Post (Authenticated)

```http
PATCH /api/posts/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Updated Title",
  "content": {...}
}
```

#### Delete a Post (Authenticated)

```http
DELETE /api/posts/:id
Authorization: Bearer YOUR_TOKEN
```

---

### 2. Media (Images & Files)

#### Get All Media

```http
GET /api/media
```

**Query Parameters:**

- `limit` - Number of items per page (default: 10)
- `page` - Page number
- `sort` - Sort field

**Example Request:**

```bash
curl "http://localhost:3000/api/media?limit=20"
```

**Example Response:**

```json
{
  "docs": [
    {
      "id": "media123",
      "alt": "My Image",
      "filename": "my-image-1234567890",
      "mimeType": "jpeg",
      "filesize": 25600,
      "width": 800,
      "height": 600,
      "url": "https://res.cloudinary.com/your-account/image/upload/v1234567890/media/my-image-1234567890.jpg",
      "createdAt": "2025-11-17T09:00:00Z",
      "updatedAt": "2025-11-17T09:00:00Z"
    }
  ],
  "totalDocs": 1,
  "limit": 20,
  "page": 1,
  "totalPages": 1
}
```

#### Get Single Media Item

```http
GET /api/media/:id
```

#### Upload Media (Authenticated)

```http
POST /api/media
Authorization: Bearer YOUR_TOKEN

(multipart/form-data)
file: <binary file>
alt: "Description of the image"
```

**Example with cURL:**

```bash
curl -X POST "http://localhost:3000/api/media" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "alt=My Image Description"
```

#### Delete Media (Authenticated)

```http
DELETE /api/media/:id
Authorization: Bearer YOUR_TOKEN
```

---

### 3. Users (Authentication)

#### Login / Get Auth Token

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Example:**

```bash
curl -X POST "http://localhost:3000/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "createdAt": "2025-11-17T08:00:00Z",
    "updatedAt": "2025-11-17T08:00:00Z"
  }
}
```

#### Logout

```http
POST /api/users/logout
Authorization: Bearer YOUR_TOKEN
```

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer YOUR_TOKEN
```

#### Refresh Auth Token

```http
POST /api/users/refresh-token
Authorization: Bearer YOUR_TOKEN
```

---

## 🔷 GraphQL API

### Base URL

```
http://localhost:3000/api/graphql
```

### Query Posts

```graphql
query {
  Posts(limit: 10, sort: "-publishedAt") {
    docs {
      id
      title
      slug
      content
      publishedAt
      createdAt
    }
    totalDocs
    limit
    page
    totalPages
    hasNextPage
    hasPrevPage
  }
}
```

**Example cURL:**

```bash
curl -X POST "http://localhost:3000/api/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { Posts(limit: 10, sort: \"-publishedAt\") { docs { id title slug publishedAt } totalDocs } }"
  }'
```

### Query Single Post

```graphql
query {
  Posts(where: { slug: { equals: "my-first-blog-post" } }) {
    docs {
      id
      title
      slug
      content
      publishedAt
    }
  }
}
```

### Query Media

```graphql
query {
  Media(limit: 20) {
    docs {
      id
      alt
      filename
      url
      width
      height
      createdAt
    }
    totalDocs
  }
}
```

### Query Users (Authenticated)

```graphql
query {
  Users {
    docs {
      id
      email
      createdAt
    }
  }
}
```

### Mutation: Create Post (Authenticated)

```graphql
mutation {
  createPosts(data: {
    title: "New Post"
    slug: "new-post"
    content: { ... }
    publishedAt: "2025-11-17T10:00:00Z"
  }) {
    id
    title
    slug
  }
}
```

### Mutation: Update Post (Authenticated)

```graphql
mutation {
  updatePosts(id: "abc123", data: { title: "Updated Title" }) {
    id
    title
  }
}
```

### Mutation: Login

```graphql
mutation {
  loginUsers(email: "user@example.com", password: "password123") {
    token
    user {
      id
      email
    }
  }
}
```

---

## 📋 Common Filtering & Sorting

### Filter by Published Date

**REST:**

```bash
# Posts published after a date
GET /api/posts?where[publishedAt][greater_than]=2025-01-01T00:00:00Z
```

**GraphQL:**

```graphql
query {
  Posts(where: { publishedAt: { greater_than: "2025-01-01T00:00:00Z" } }) {
    docs {
      id
      title
      publishedAt
    }
  }
}
```

### Sort by Different Fields

**REST:**

```bash
# Newest first
GET /api/posts?sort=-publishedAt

# Oldest first
GET /api/posts?sort=publishedAt

# By title (A-Z)
GET /api/posts?sort=title
```

**GraphQL:**

```graphql
query {
  Posts(sort: "-publishedAt") {
    docs {
      id
      title
    }
  }
}
```

### Pagination

**REST:**

```bash
# Page 2, 5 items per page
GET /api/posts?page=2&limit=5
```

**GraphQL:**

```graphql
query {
  Posts(page: 2, limit: 5) {
    docs {
      id
      title
    }
    page
    totalPages
  }
}
```

---

## 🔐 Authentication

### How to Authenticate

1. **Login** to get a token:

   ```bash
   curl -X POST "http://localhost:3000/api/users/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl "http://localhost:3000/api/posts" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Token Format

Tokens are JWT (JSON Web Tokens) and should be sent in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Protected Endpoints

- `POST /api/posts` - Create post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/media` - Upload media
- `DELETE /api/media/:id` - Delete media
- `GET /api/users/me` - Get current user
- `POST /api/users/logout` - Logout

### Public Endpoints

- `GET /api/posts` - List posts (no auth required)
- `GET /api/posts/:id` - Get post (no auth required)
- `GET /api/media` - List media (no auth required)
- `GET /api/media/:id` - Get media (no auth required)
- `POST /api/users/login` - Login (no auth required)

---

## 🚀 Usage Examples

### JavaScript/TypeScript (Fetch API)

#### Get All Posts

```typescript
async function getPosts() {
  const response = await fetch('http://localhost:3000/api/posts?limit=10&sort=-publishedAt')
  const data = await response.json()
  return data.docs
}
```

#### Get Post by Slug

```typescript
async function getPostBySlug(slug: string) {
  const response = await fetch(`http://localhost:3000/api/posts?where[slug][equals]=${slug}`)
  const data = await response.json()
  return data.docs[0]
}
```

#### Create Post (Authenticated)

```typescript
async function createPost(token: string, postData: any) {
  const response = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  })
  return response.json()
}
```

#### Upload Media

```typescript
async function uploadMedia(token: string, file: File, alt: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('alt', alt)

  const response = await fetch('http://localhost:3000/api/media', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  return response.json()
}
```

#### Login

```typescript
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  const { token, user } = await response.json()
  return { token, user }
}
```

### Python Example

#### Get All Posts

```python
import requests

response = requests.get('http://localhost:3000/api/posts?limit=10&sort=-publishedAt')
posts = response.json()['docs']
print(posts)
```

#### Login and Create Post

```python
import requests
import json

# Login
login_response = requests.post(
    'http://localhost:3000/api/users/login',
    json={'email': 'user@example.com', 'password': 'password123'}
)
token = login_response.json()['token']

# Create post
headers = {'Authorization': f'Bearer {token}'}
post_data = {
    'title': 'New Post',
    'slug': 'new-post',
    'content': {...},
    'publishedAt': '2025-11-17T10:00:00Z'
}
response = requests.post('http://localhost:3000/api/posts', json=post_data, headers=headers)
print(response.json())
```

---

## 🛠️ Error Handling

### Response Status Codes

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 200    | Success                              |
| 201    | Created                              |
| 204    | No Content                           |
| 400    | Bad Request (invalid data)           |
| 401    | Unauthorized (missing/invalid token) |
| 403    | Forbidden (insufficient permissions) |
| 404    | Not Found                            |
| 409    | Conflict (duplicate slug)            |
| 500    | Server Error                         |

### Error Response Example

```json
{
  "errors": [
    {
      "message": "The following field is required: title",
      "field": "title"
    }
  ]
}
```

---

## 📚 Field Definitions

### Posts Collection

| Field         | Type     | Required | Notes                                    |
| ------------- | -------- | -------- | ---------------------------------------- |
| `id`          | string   | Auto     | Unique identifier                        |
| `title`       | text     | Yes      | Post title                               |
| `slug`        | text     | Yes      | URL-friendly identifier (must be unique) |
| `content`     | richText | No       | Blog content (Lexical format)            |
| `publishedAt` | date     | No       | Publication date                         |
| `createdAt`   | date     | Auto     | Creation timestamp                       |
| `updatedAt`   | date     | Auto     | Last update timestamp                    |

### Media Collection

| Field       | Type   | Required | Notes                      |
| ----------- | ------ | -------- | -------------------------- |
| `id`        | string | Auto     | Unique identifier          |
| `filename`  | string | Auto     | Cloudinary public ID       |
| `alt`       | text   | Yes      | Image description          |
| `mimeType`  | string | Auto     | File MIME type             |
| `filesize`  | number | Auto     | File size in bytes         |
| `width`     | number | Auto     | Image width (images only)  |
| `height`    | number | Auto     | Image height (images only) |
| `url`       | string | Auto     | Cloudinary CDN URL         |
| `createdAt` | date   | Auto     | Upload timestamp           |
| `updatedAt` | date   | Auto     | Last update timestamp      |

### Users Collection

| Field       | Type   | Required | Notes                      |
| ----------- | ------ | -------- | -------------------------- |
| `id`        | string | Auto     | Unique identifier          |
| `email`     | text   | Yes      | User email (unique)        |
| `password`  | text   | Yes      | Hashed password            |
| `createdAt` | date   | Auto     | Account creation timestamp |
| `updatedAt` | date   | Auto     | Last update timestamp      |

---

## 🔗 Rich Text Content Format

Blog content is stored in **Lexical** format (Payload's default rich text editor):

```json
{
  "root": {
    "type": "root",
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "text": "Hello world"
          }
        ]
      },
      {
        "type": "heading",
        "tag": "h2",
        "children": [
          {
            "type": "text",
            "text": "Subheading"
          }
        ]
      }
    ]
  }
}
```

To display this content in your frontend, use the `@payloadcms/richtext-lexical` package or convert it to HTML.

---

## 🧪 Testing APIs

### Using GraphQL Playground

Visit: `http://localhost:3000/api/graphql-playground`

This provides an interactive interface to write and test GraphQL queries.

### Using Postman

1. Import the collection from the admin panel (Payload provides export functionality)
2. Set up environment variables for `base_url` and `token`
3. Use the pre-built requests

### Using Thunder Client / REST Client

VS Code Extensions like **Thunder Client** or **REST Client** can test endpoints directly in the editor.

---

## 📖 Additional Resources

- **Payload CMS Docs**: https://payloadcms.com/docs
- **GraphQL Docs**: https://graphql.org/learn/
- **REST API Best Practices**: https://restfulapi.net/
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Last Updated**: November 17, 2025
