# 🛍️ Product Catalog CMS

A modern product catalog content management system built with Strapi, featuring product management, categorization, and an advanced review moderation system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Plugins](#plugins)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📚 Documentation Index

- **📖 [API Documentation](docs/API.md)** - Complete API reference with examples
- **🚀 [Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **🤝 [Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **🔌 [Plugin Documentation](src/plugins/review-moderation/README.md)** - Review moderation plugin guide

## 🎯 Overview

This Product Catalog CMS is designed for e-commerce businesses to manage their product inventory, organize products into categories, and moderate customer reviews. Built on Strapi 5.19.0 with TypeScript, it provides a robust admin interface and REST API for frontend applications.

## ✨ Features

### Core Features
- **Product Management**: Complete CRUD operations for products with images, pricing, and descriptions
- **Category Organization**: Hierarchical product categorization system
- **Review System**: Customer review collection with ratings (1-5 stars)
- **Review Moderation**: Custom plugin for approving/rejecting reviews
- **Content Moderation**: Automatic banned word detection in reviews
- **Media Management**: AWS S3 integration for image storage
- **API Documentation**: Auto-generated OpenAPI documentation

### Technical Features
- TypeScript support throughout the application
- PostgreSQL/MySQL/SQLite database support
- RESTful API with authentication
- Admin panel with custom plugin interface
- Middleware for content validation
- Draft and publish workflow

## 🏗️ Architecture

### Content Types
1. **Product** (`api::product.product`)
   - Name, description, price
   - Multiple images support
   - Category relationship
   - Reviews relationship

2. **Category** (`api::category.category`)
   - Name and description
   - One-to-many relationship with products

3. **Review** (`api::review.review`)
   - Reviewer name, rating, comment
   - Approval status
   - Belongs to a product

### Custom Plugin
- **Review Moderation Plugin**: Located at `src/plugins/review-moderation`
  - Admin interface for review management
  - Bulk approve/reject operations
  - Review statistics dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js (18.x - 22.x)
- npm (6.x or higher)
- Database (PostgreSQL recommended, SQLite for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Strapi-Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the review moderation plugin**
   ```bash
   cd src/plugins/review-moderation
   npm install
   npm run build
   cd ../../..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Build the application**
   ```bash
   npm run build
   ```

6. **Start development server**
   ```bash
   npm run develop
   ```

The admin panel will be available at `http://localhost:1337/admin`

## ⚙️ Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Security Keys (CHANGE THESE!)
APP_KEYS="generate-random-key-1,generate-random-key-2"
API_TOKEN_SALT=generate-random-salt
ADMIN_JWT_SECRET=generate-random-jwt-secret
TRANSFER_TOKEN_SALT=generate-random-transfer-salt
JWT_SECRET=generate-random-jwt-secret
ENCRYPTION_KEY=generate-random-encryption-key

# Database Configuration (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=product_catalog
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET=your-bucket-name
```

### Database Options

**PostgreSQL (Recommended for production)**
```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

**SQLite (Development only)**
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**MySQL**
```env
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

## 💻 Development

### Available Scripts

```bash
# Development with auto-reload
npm run develop

# Production build
npm run build

# Start production server
npm run start

# Access Strapi console
npm run console

# Deploy (if configured)
npm run deploy
```

### Plugin Development

The review moderation plugin is located in `src/plugins/review-moderation/`. To modify the plugin:

1. Navigate to the plugin directory
2. Make your changes
3. Rebuild the plugin: `npm run build`
4. Restart the main application

### Code Structure

```
src/
├── admin/              # Admin panel customizations
├── api/                # API endpoints and logic
│   ├── category/       # Category content type
│   ├── product/        # Product content type
│   └── review/         # Review content type with middleware
├── extensions/         # Core extensions
└── plugins/
    └── review-moderation/  # Custom review moderation plugin
```

## 📚 API Documentation

### Quick Reference

#### Core Endpoints
- **Products**: `/api/products` - CRUD operations for products
- **Categories**: `/api/categories` - CRUD operations for categories  
- **Reviews**: `/api/reviews` - CRUD operations for reviews
- **Review Moderation**: `/admin/api/review-moderation/*` - Admin review management

### Authentication
Most endpoints require authentication via API tokens generated in the admin panel.

### Query Features
- **Population**: `?populate=category,reviews`
- **Filtering**: `?filters[category][name][$eq]=Electronics`
- **Sorting**: `?sort=price:asc`
- **Pagination**: `?pagination[page]=1&pagination[pageSize]=10`

### Documentation Resources
- **📖 [Complete API Documentation](docs/API.md)** - Detailed endpoint reference with examples
- **🌐 Interactive Docs**: `http://localhost:1337/documentation` - Auto-generated OpenAPI interface
- **🔧 [Plugin API Reference](src/plugins/review-moderation/README.md#api-endpoints)** - Review moderation endpoints

## 🔌 Plugins

### Review Moderation Plugin

Custom plugin for managing product reviews with the following features:

- **Review Dashboard**: View all reviews with approval status
- **Bulk Actions**: Approve or reject multiple reviews
- **Statistics**: Review metrics and analytics
- **Word Filtering**: Automatic detection of banned words

For detailed plugin documentation, see [Plugin README](src/plugins/review-moderation/README.md).

### Installed Plugins

- **Documentation**: Auto-generates API documentation
- **Upload**: File upload with AWS S3 support
- **Users & Permissions**: Authentication and authorization
- **Cloud**: Strapi Cloud integration

## 🚀 Deployment

### Quick Deploy

For detailed deployment instructions, see **[📋 Deployment Guide](docs/DEPLOYMENT.md)**.

#### Production Checklist
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up secure environment variables
- [ ] Configure AWS S3 for file uploads
- [ ] Set up SSL/HTTPS
- [ ] Configure domain and DNS

#### Deployment Platforms

**Heroku (Recommended for beginners)**
```bash
git push heroku main
```

**DigitalOcean App Platform**
```bash
# Use app.yaml configuration
doctl apps create --spec app.yaml
```

**AWS/VPS with PM2**
```bash
npm run build
pm2 start ecosystem.config.js
```

### Environment Variables for Production
Essential variables for production deployment:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:password@host:port/database
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET=your-s3-bucket
```

For complete deployment instructions including database setup, file storage configuration, and platform-specific guides, see the **[Deployment Guide](docs/DEPLOYMENT.md)**.

## 🤝 Contributing

We welcome contributions! Please see our **[Contributing Guide](CONTRIBUTING.md)** for detailed information.

### Quick Start for Contributors

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Build the plugin**: `cd src/plugins/review-moderation && npm run build`
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Test changes in both development and production builds
- Update documentation for API changes
- Ensure plugin functionality works correctly
- Follow conventional commit messages

For detailed contribution guidelines, development setup, code standards, and testing procedures, see the **[Contributing Guide](CONTRIBUTING.md)**.

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Documentation**: [Strapi Documentation](https://docs.strapi.io)
- **Community**: [Strapi Discord](https://discord.strapi.io)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Strapi**
