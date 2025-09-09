# 📝 Review Moderation Plugin

A custom Strapi plugin for managing and moderating product reviews with approval workflows, content filtering, and administrative controls.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Review Moderation Plugin provides a comprehensive solution for managing product reviews in your Strapi application. It includes an admin interface for reviewing submissions, bulk operations for efficiency, and automated content filtering to maintain quality standards.

## ✨ Features

### Admin Interface
- **Review Dashboard**: View all reviews with approval status
- **Filtering Options**: Filter by approval status, product, rating
- **Bulk Operations**: Approve or reject multiple reviews simultaneously
- **Review Statistics**: Analytics dashboard with key metrics
- **Search Functionality**: Find specific reviews quickly

### Content Management
- **Approval Workflow**: Reviews require moderation before appearing publicly
- **Content Filtering**: Automatic detection and blocking of inappropriate content
- **Banned Word Detection**: Configurable word filter for comment validation
- **Rating System**: 1-5 star rating validation and display

### API Integration
- **REST Endpoints**: Full API for review management operations
- **Service Layer**: Reusable business logic for review operations
- **Middleware Integration**: Automatic content validation on review submission
- **Document Service**: Compatible with Strapi 5.x Document Service API

## 🚀 Installation

### Prerequisites
- Strapi 5.19.0 or higher
- Node.js 18.x or higher
- Product content type (for review association)

### Setup

1. **Plugin is already installed in this project**, but if installing elsewhere:
   ```bash
   # Copy plugin to your Strapi project
   cp -r src/plugins/review-moderation /path/to/your-strapi/src/plugins/
   ```

2. **Install plugin dependencies**
   ```bash
   cd src/plugins/review-moderation
   npm install
   ```

3. **Build the plugin**
   ```bash
   npm run build
   ```

4. **Enable in plugins configuration** (`config/plugins.ts`):
   ```typescript
   export default {
     'review-moderation': {
       enabled: true,
       resolve: './src/plugins/review-moderation'
     },
   }
   ```

5. **Restart Strapi**
   ```bash
   npm run develop
   ```

## ⚙️ Configuration

### Banned Words Configuration

Edit `src/api/review/middlewares/banned-word-validation.ts` to customize banned words:

```typescript
const bannedWords = ['spam', 'fake', 'inappropriate', 'custom-word'];
```

### Plugin Settings

The plugin automatically configures itself with the following defaults:
- Authentication: Uses Strapi admin authentication
- Permissions: Admin-level access required
- Content Type: Integrates with `api::review.review`

## 📖 Usage

### Admin Panel Access

1. **Navigate to the admin panel**: `http://localhost:1337/admin`
2. **Find "Review Moderation"** in the main navigation
3. **Access plugin features**:
   - Review list with approval actions
   - Statistics dashboard
   - Bulk operations toolbar

### Review Management Workflow

1. **New Review Submission**
   - Customer submits review via API
   - Automatic banned word validation
   - Review saved with `approved: false` status

2. **Moderation Process**
   - Admin views pending reviews
   - Reviews content and rating
   - Approves or rejects review

3. **Public Display**
   - Only approved reviews appear in public API
   - Rejected reviews remain in system for audit

### API Usage Examples

#### Submit a New Review
```bash
POST /api/reviews
Content-Type: application/json

{
  "data": {
    "reviewer_name": "John Doe",
    "rating": 5,
    "comment": "Great product! Highly recommended.",
    "product": 1
  }
}
```

#### Get Approved Reviews for a Product
```bash
GET /api/reviews?filters[product][id][$eq]=1&filters[approved][$eq]=true&populate=product
```

#### Admin: Get All Reviews for Moderation
```bash
GET /admin/api/review-moderation/reviews
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Admin: Approve a Review
```bash
PUT /admin/api/review-moderation/reviews/1/approve
Authorization: Bearer YOUR_ADMIN_TOKEN
```

## 🔗 API Endpoints

### Admin Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/api/review-moderation/reviews` | Get all reviews for moderation |
| `GET` | `/admin/api/review-moderation/reviews/stats` | Get review statistics |
| `PUT` | `/admin/api/review-moderation/reviews/:id/approve` | Approve specific review |
| `PUT` | `/admin/api/review-moderation/reviews/:id/reject` | Reject specific review |

### Response Examples

#### Get All Reviews
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "reviewer_name": "John Doe",
        "rating": 5,
        "comment": "Excellent product!",
        "approved": false,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "product": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Sample Product"
            }
          }
        }
      }
    }
  ],
  "message": "Reviews fetched successfully"
}
```

#### Review Statistics
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

## 💻 Development

### Plugin Structure

```
review-moderation/
├── admin/                  # Admin panel components
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Plugin pages (HomePage, etc.)
│   │   ├── translations/  # Internationalization
│   │   └── index.ts       # Plugin entry point
├── server/                # Backend logic
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Custom middleware
│   │   └── index.ts       # Server entry point
├── package.json           # Plugin dependencies
└── README.md             # This file
```

### Key Components

#### Controller (`server/src/controllers/controller.ts`)
Handles HTTP requests and responses for review operations:
- `getAllReviews()`: Fetch all reviews with product data
- `approveReview()`: Set review approval status to true
- `rejectReview()`: Set review approval status to false
- `getReviewStats()`: Calculate review statistics

#### Service (`server/src/services/reviewService.ts`)
Business logic layer for review operations:
- Database interactions using Document Service API
- Data validation and transformation
- Error handling and logging

#### Routes (`server/src/routes/admin-api.ts`)
Defines API endpoints and their handlers:
- RESTful route structure
- Authentication configuration
- Request/response mapping

### Building the Plugin

```bash
# Development mode with watch
npm run watch

# Production build
npm run build

# TypeScript compilation check
npm run test:ts:back  # Backend TypeScript
npm run test:ts:front # Frontend TypeScript
```

### Testing Changes

1. **Make your changes** to plugin files
2. **Rebuild the plugin**:
   ```bash
   npm run build
   ```
3. **Restart Strapi** to load changes:
   ```bash
   # In main project directory
   npm run develop
   ```

## 🏗️ Architecture

### Data Flow

1. **Review Submission** → Middleware Validation → Database Storage
2. **Admin Interface** → Plugin Controller → Service Layer → Database
3. **Public API** → Strapi Core → Filtered Results (approved only)

### Integration Points

- **Content Type**: `api::review.review`
- **Middleware**: `banned-word-validation.ts`
- **Plugin Services**: Document Service API
- **Admin Panel**: Strapi Admin UI extensions

### Security Considerations

- **Authentication**: All admin endpoints require valid Strapi admin tokens
- **Authorization**: Plugin respects Strapi's permission system
- **Input Validation**: Banned word filtering and data sanitization
- **SQL Injection Protection**: Uses Strapi's query builder

## 🔧 Troubleshooting

### Common Issues

#### Plugin Not Appearing in Admin Panel
```bash
# Check if plugin is properly built
ls src/plugins/review-moderation/dist/

# Rebuild if dist folder is missing
cd src/plugins/review-moderation
npm run build
```

#### API Endpoints Not Working
```bash
# Verify plugin is enabled in config/plugins.ts
# Check Strapi logs for errors
npm run develop --debug
```

#### Review Statistics Not Updating
```bash
# Check if reviews exist in database
# Verify service logic in server/src/services/reviewService.ts
```

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
DEBUG=strapi:plugin:review-moderation npm run develop
```

### Plugin Logs

Monitor plugin activity:
```bash
# Check console output for plugin-specific messages
# Look for "Document Service Middleware" logs
# Review API request/response logs
```

### Development Tips

1. **Use TypeScript**: The plugin is fully typed for better development experience
2. **Hot Reload**: Use `npm run watch` during development
3. **Error Handling**: Check browser console and server logs for issues
4. **API Testing**: Use tools like Postman or curl to test endpoints
5. **Database Inspection**: Use Strapi admin panel to verify data changes

## 📚 Additional Resources

- [Strapi Plugin Development Guide](https://docs.strapi.io/dev-docs/plugins-development)
- [Strapi Document Service API](https://docs.strapi.io/dev-docs/api/document-service)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## 🤝 Contributing

1. **Follow the main project's contribution guidelines**
2. **Test plugin functionality thoroughly**
3. **Update documentation for any API changes**
4. **Maintain TypeScript compliance**
5. **Consider backward compatibility**

---

**Plugin developed by**: Bhavya Barai (bhavya.barai@simformsolutions.com)
