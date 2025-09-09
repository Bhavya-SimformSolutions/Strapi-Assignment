# 📡 API Documentation

Comprehensive API reference for the Product Catalog CMS.

## 🔑 Authentication

Most endpoints require authentication. You can authenticate using:

1. **Admin Token**: For admin operations and content management
2. **API Token**: For programmatic access to content
3. **JWT Token**: For user-specific operations

### Getting an API Token

1. Navigate to Settings → API Tokens in the Strapi admin panel
2. Create a new token with appropriate permissions
3. Use the token in your requests:

```bash
Authorization: Bearer YOUR_API_TOKEN
```

## 📊 Response Format

All API responses follow this format:

```json
{
  "data": {}, // or []
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}
```

## 🛍️ Products API

### List Products

```http
GET /api/products
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `populate` | string | Relations to populate | `category,reviews` |
| `filters` | object | Filter criteria | `filters[category][name][$eq]=Electronics` |
| `sort` | string | Sort field and order | `price:desc` |
| `pagination[page]` | number | Page number | `1` |
| `pagination[pageSize]` | number | Items per page | `10` |

**Example Request:**
```bash
GET /api/products?populate=category,reviews&sort=price:asc&pagination[pageSize]=5
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Smartphone X",
        "description": "Latest smartphone with advanced features",
        "price": "699.99",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z",
        "publishedAt": "2024-01-01T10:00:00.000Z",
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Electronics",
              "description": "Electronic devices and gadgets"
            }
          }
        },
        "reviews": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "reviewer_name": "John Doe",
                "rating": 5,
                "comment": "Excellent product!",
                "approved": true
              }
            }
          ]
        },
        "images": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "url": "/uploads/smartphone_x_001.jpg",
                "alternativeText": "Smartphone X front view"
              }
            }
          ]
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 5,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### Get Single Product

```http
GET /api/products/:id
```

**Example Request:**
```bash
GET /api/products/1?populate=category,reviews,images
```

### Create Product

```http
POST /api/products
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:**
```json
{
  "data": {
    "name": "New Product",
    "description": "Product description",
    "price": 29.99,
    "category": 1
  }
}
```

### Update Product

```http
PUT /api/products/:id
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:**
```json
{
  "data": {
    "name": "Updated Product Name",
    "price": 34.99
  }
}
```

### Delete Product

```http
DELETE /api/products/:id
Authorization: Bearer YOUR_API_TOKEN
```

## 📂 Categories API

### List Categories

```http
GET /api/categories
```

**Example Request:**
```bash
GET /api/categories?populate=products&sort=name:asc
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Electronics",
        "description": "Electronic devices and gadgets",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "products": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "Smartphone X",
                "price": "699.99"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### Create Category

```http
POST /api/categories
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:**
```json
{
  "data": {
    "name": "Books",
    "description": "Books and literature"
  }
}
```

## ⭐ Reviews API

### List Reviews

```http
GET /api/reviews
```

**Common Filters:**
- Approved reviews only: `filters[approved][$eq]=true`
- By product: `filters[product][id][$eq]=1`
- By rating: `filters[rating][$gte]=4`

**Example Request:**
```bash
GET /api/reviews?filters[approved][$eq]=true&populate=product&sort=createdAt:desc
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "reviewer_name": "John Doe",
        "rating": 5,
        "comment": "Excellent product! Highly recommend.",
        "approved": true,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "product": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Smartphone X"
            }
          }
        }
      }
    }
  ]
}
```

### Submit Review

```http
POST /api/reviews
Content-Type: application/json
```

**Request Body:**
```json
{
  "data": {
    "reviewer_name": "Jane Smith",
    "rating": 4,
    "comment": "Good product with minor issues",
    "product": 1
  }
}
```

**Validation Rules:**
- `reviewer_name`: Required, max 255 characters
- `rating`: Required, integer between 1-5
- `comment`: Required, text field
- `product`: Required, valid product ID

**Note**: New reviews are created with `approved: false` and require moderation.

## 🔧 Review Moderation API (Admin)

### Get All Reviews for Moderation

```http
GET /admin/api/review-moderation/reviews
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "reviewer_name": "John Doe",
        "rating": 5,
        "comment": "Great product!",
        "approved": false,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "product": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Smartphone X"
            }
          }
        }
      }
    }
  ],
  "message": "Reviews fetched successfully"
}
```

### Approve Review

```http
PUT /admin/api/review-moderation/reviews/:id/approve
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "reviewer_name": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "approved": true,
      "updatedAt": "2024-01-01T11:00:00.000Z"
    }
  },
  "message": "Review approved successfully"
}
```

### Reject Review

```http
PUT /admin/api/review-moderation/reviews/:id/reject
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Get Review Statistics

```http
GET /admin/api/review-moderation/reviews/stats
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Example Response:**
```json
{
  "data": {
    "total": 150,
    "approved": 120,
    "pending": 25,
    "rejected": 5,
    "averageRating": 4.2
  },
  "message": "Review statistics fetched successfully"
}
```

## 📤 File Upload API

### Upload Files

```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_TOKEN
```

**Form Data:**
- `files`: File(s) to upload
- `ref`: Content type (e.g., 'api::product.product')
- `refId`: Entity ID
- `field`: Field name (e.g., 'images')

**Example using curl:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "files=@product-image.jpg" \
  -F "ref=api::product.product" \
  -F "refId=1" \
  -F "field=images" \
  http://localhost:1337/api/upload
```

## 🔍 Query Parameters Reference

### Filtering

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `filters[name][$eq]=Product` |
| `$ne` | Not equal | `filters[approved][$ne]=false` |
| `$lt` | Less than | `filters[price][$lt]=100` |
| `$lte` | Less than or equal | `filters[price][$lte]=100` |
| `$gt` | Greater than | `filters[rating][$gt]=3` |
| `$gte` | Greater than or equal | `filters[rating][$gte]=4` |
| `$in` | In array | `filters[category][$in][0]=1&filters[category][$in][1]=2` |
| `$notIn` | Not in array | `filters[id][$notIn][0]=1` |
| `$contains` | Contains | `filters[name][$contains]=phone` |
| `$notContains` | Not contains | `filters[comment][$notContains]=spam` |
| `$containsi` | Contains (case insensitive) | `filters[name][$containsi]=PHONE` |
| `$startsWith` | Starts with | `filters[name][$startsWith]=Smart` |
| `$endsWith` | Ends with | `filters[name][$endsWith]=Pro` |

### Sorting

```bash
# Single field
sort=name:asc
sort=price:desc

# Multiple fields
sort[0]=price:asc&sort[1]=name:asc
```

### Pagination

```bash
# Offset pagination
pagination[start]=0&pagination[limit]=10

# Page pagination
pagination[page]=1&pagination[pageSize]=25
```

### Population

```bash
# Single relation
populate=category

# Multiple relations
populate[0]=category&populate[1]=reviews

# Nested population
populate[category][populate]=products
populate[reviews][populate]=product
```

## ❌ Error Responses

### Common Error Codes

| Status | Error Type | Description |
|--------|------------|-------------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid request data",
    "details": {
      "errors": [
        {
          "path": ["rating"],
          "message": "Rating must be between 1 and 5",
          "name": "ValidationError"
        }
      ]
    }
  }
}
```

## 🧪 Testing Examples

### Using JavaScript/Fetch

```javascript
// Get products
const products = await fetch('http://localhost:1337/api/products?populate=category')
  .then(response => response.json());

// Submit review
const review = await fetch('http://localhost:1337/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    data: {
      reviewer_name: 'Test User',
      rating: 5,
      comment: 'Great product!',
      product: 1
    }
  })
}).then(response => response.json());
```

### Using cURL

```bash
# Get products with category
curl -X GET "http://localhost:1337/api/products?populate=category"

# Create product (requires authentication)
curl -X POST "http://localhost:1337/api/products" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test Product",
      "description": "Test description",
      "price": 29.99,
      "category": 1
    }
  }'

# Submit review
curl -X POST "http://localhost:1337/api/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "reviewer_name": "John Doe",
      "rating": 5,
      "comment": "Excellent product!",
      "product": 1
    }
  }'
```

## 📖 Interactive Documentation

For interactive API documentation with request/response examples, visit:
```
http://localhost:1337/documentation
```

This provides a Swagger/OpenAPI interface where you can test endpoints directly from the browser.

---

For more information, see the [main README](../README.md) or [Strapi API documentation](https://docs.strapi.io/dev-docs/api/rest).