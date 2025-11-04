```markdown
# Express.js RESTful API Assignment

This project implements the Week 2 assignment: a RESTful API for products using Express.js.

## Quick Start

1. Copy .env.example to .env and set values:
   ```
   PORT=3000
   API_KEY=my-secret-api-key
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start:
   ```
   npm start
   ```

4. The server will run at http://localhost:3000

## API Endpoints

Base: /api/products

- GET /api/products
  - Query params:
    - category (string) - filter by category
    - search (string) - search by name (case-insensitive)
    - page (number) - page number (default 1)
    - limit (number) - items per page (default 10)
  - Response:
    - { page, limit, total, data: [products...] }

- GET /api/products/:id
  - Get a single product by ID

- POST /api/products
  - Requires header: x-api-key: <API_KEY>
  - Body (JSON):
    - name (string, min 2 chars)
    - description (string, min 5 chars)
    - price (number, >=0)
    - category (string)
    - inStock (boolean)
  - Creates a product. Returns 201 with created product.

- PUT /api/products/:id
  - Requires header: x-api-key: <API_KEY>
  - Body: same as POST
  - Updates an existing product

- DELETE /api/products/:id
  - Requires header: x-api-key: <API_KEY>
  - Deletes a product

- GET /api/products/stats
  - Returns total and count by category:
    - { total, countByCategory: { electronics: 2, kitchen: 1 } }

## Authentication

- The server uses a simple API key mechanism.
- Provide API key in the `x-api-key` header or `Authorization: Bearer <key>`.
- For local development, the default key is `my-secret-api-key`, set in .env.

## Error Handling

- Validation errors return 400 with details.
- Unauthorized requests return 401.
- Not found resources return 404.
- Unexpected errors return 500.

## Examples

Create product (curl):
```
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{
    "name":"Blender",
    "description":"Powerful blender",
    "price":99.99,
    "category":"kitchen",
    "inStock":true
  }'
```

List products with pagination:
```
curl "http://localhost:3000/api/products?page=1&limit=2"
```

Search by name:
```
curl "http://localhost:3000/api/products?search=lap"
```

Get stats:
```
curl http://localhost:3000/api/products/stats
```

## Notes

- This implementation uses in-memory storage (an array). For production, replace with a database.

```