# 🚀 Deployment Guide

Comprehensive deployment guide for the Product Catalog CMS across different environments and platforms.

## 📋 Table of Contents

- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [File Storage Configuration](#file-storage-configuration)
- [Deployment Options](#deployment-options)
- [Post-deployment Tasks](#post-deployment-tasks)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## ✅ Pre-deployment Checklist

Before deploying to production, ensure:

- [ ] **Database is configured** and accessible
- [ ] **Environment variables are set** with production values
- [ ] **Security keys are generated** and secure
- [ ] **AWS S3 bucket is configured** (if using file uploads)
- [ ] **SSL certificate is ready** for HTTPS
- [ ] **Domain/subdomain is configured**
- [ ] **Backup strategy is in place**
- [ ] **Monitoring is set up**

## ⚙️ Environment Configuration

### Production Environment Variables

Create a `.env` file with production values:

```env
# Server Configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Security Keys (GENERATE UNIQUE VALUES!)
APP_KEYS=generate-unique-key-1,generate-unique-key-2,generate-unique-key-3,generate-unique-key-4
API_TOKEN_SALT=generate-unique-api-token-salt
ADMIN_JWT_SECRET=generate-unique-admin-jwt-secret
TRANSFER_TOKEN_SALT=generate-unique-transfer-token-salt
JWT_SECRET=generate-unique-jwt-secret
ENCRYPTION_KEY=generate-unique-encryption-key-32-chars

# Database Configuration (PostgreSQL recommended)
DATABASE_CLIENT=postgres
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_NAME=product_catalog_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure-database-password
DATABASE_SSL=true

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=your-s3-bucket-name
AWS_SIGNED_URL_EXPIRES=900

# Optional: External URL configuration
STRAPI_ADMIN_BACKEND_URL=https://your-domain.com
```

### Generating Secure Keys

Use these methods to generate secure keys:

```bash
# Generate random keys (Linux/macOS)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using online generators (ensure they're from trusted sources)
# Example: https://generate-secret.vercel.app/32
```

### Environment Variables by Platform

#### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set APP_KEYS="key1,key2,key3,key4"
heroku config:set DATABASE_URL="postgresql://..."
```

#### Vercel
```bash
vercel env add NODE_ENV
vercel env add APP_KEYS
vercel env add DATABASE_URL
```

#### AWS/DigitalOcean
Set environment variables in your deployment platform's interface or configuration files.

## 🗄️ Database Setup

### PostgreSQL (Recommended)

#### 1. Create Database and User

```sql
-- Connect as superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE product_catalog_prod;

-- Create user
CREATE USER strapi_user WITH PASSWORD 'secure-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE product_catalog_prod TO strapi_user;
GRANT ALL ON SCHEMA public TO strapi_user;

-- Exit
\q
```

#### 2. Configure Connection

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost  # or your database host
DATABASE_PORT=5432
DATABASE_NAME=product_catalog_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure-password
DATABASE_SSL=true  # Enable for production
```

#### 3. Managed Database Services

**AWS RDS:**
```env
DATABASE_HOST=your-rds-endpoint.region.rds.amazonaws.com
DATABASE_SSL=true
```

**Google Cloud SQL:**
```env
DATABASE_HOST=your-instance-ip
DATABASE_SSL=true
```

**DigitalOcean Managed Database:**
```env
DATABASE_HOST=your-db-cluster.db.ondigitalocean.com
DATABASE_SSL=true
```

### MySQL Alternative

```env
DATABASE_CLIENT=mysql
DATABASE_HOST=your-mysql-host
DATABASE_PORT=3306
DATABASE_NAME=product_catalog_prod
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure-password
DATABASE_SSL=true
```

## 📁 File Storage Configuration

### AWS S3 Setup

#### 1. Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-product-catalog-bucket --region us-east-1

# Set bucket policy for public read access
aws s3api put-bucket-policy --bucket your-product-catalog-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-product-catalog-bucket/*"
    }
  ]
}'
```

#### 2. Create IAM User

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-product-catalog-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::your-product-catalog-bucket"
    }
  ]
}
```

#### 3. Environment Configuration

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=your-product-catalog-bucket
```

### Alternative Storage Options

#### Cloudinary
```bash
npm install @strapi/provider-upload-cloudinary
```

```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: 'your-cloud-name',
        api_key: 'your-api-key',
        api_secret: 'your-api-secret',
      },
    },
  },
};
```

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Step-by-step Heroku Deployment

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set APP_KEYS="key1,key2,key3,key4"
heroku config:set API_TOKEN_SALT="your-token-salt"
heroku config:set ADMIN_JWT_SECRET="your-admin-jwt-secret"
heroku config:set TRANSFER_TOKEN_SALT="your-transfer-salt"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set ENCRYPTION_KEY="your-encryption-key"

# Deploy
git push heroku main
```

#### Heroku Configuration Files

**Procfile:**
```
web: npm run start
```

**package.json scripts:**
```json
{
  "scripts": {
    "start": "strapi start",
    "build": "strapi build",
    "heroku-postbuild": "npm run build"
  }
}
```

### 2. DigitalOcean App Platform

#### app.yaml Configuration

```yaml
name: product-catalog-cms
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/Strapi-Assignment
      branch: main
    run_command: npm run start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: APP_KEYS
        value: key1,key2,key3,key4
        type: SECRET
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
        type: SECRET
    build_command: npm run build

databases:
  - name: db
    engine: PG
    num_nodes: 1
    size: db-s-dev-database
    version: "13"
```

### 3. Vercel Deployment

#### vercel.json Configuration

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Note:** Vercel has limitations with Strapi. Consider using their Edge Functions or switch to a different platform.

### 4. AWS Deployment

#### Using AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

#### Using AWS ECS/Fargate

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build plugin
RUN cd src/plugins/review-moderation && npm ci && npm run build && cd ../../..

# Build application
RUN npm run build

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:1337/_health || exit 1

# Start application
CMD ["npm", "run", "start"]
```

### 5. VPS/Dedicated Server

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 configuration
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'product-catalog-cms',
    script: 'npm',
    args: 'run start',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 1337
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true
  }]
};

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    client_max_body_size 50M;
}
```

## 🔧 Post-deployment Tasks

### 1. Admin Account Setup

After deployment, create the first admin account:

1. Visit `https://your-domain.com/admin`
2. Complete the admin registration form
3. Set up additional admin users if needed

### 2. Content Type Permissions

Configure API permissions:

1. Go to Settings → Users & Permissions → Roles
2. Configure Public role permissions
3. Set up authenticated user permissions
4. Configure API token permissions

### 3. Plugin Configuration

Ensure the review moderation plugin is working:

1. Check plugin appears in admin sidebar
2. Test review creation and moderation
3. Verify statistics are displaying correctly

### 4. SSL/HTTPS Setup

Ensure HTTPS is properly configured:

1. Install SSL certificate
2. Configure redirect from HTTP to HTTPS
3. Update `STRAPI_ADMIN_BACKEND_URL` if needed
4. Test admin panel and API over HTTPS

### 5. Database Migration

If migrating from development:

```bash
# Export data from development
npm run strapi export

# Import data to production
npm run strapi import
```

## 📊 Monitoring and Maintenance

### Health Checks

Create health check endpoints:

```javascript
// config/middlewares.js
module.exports = [
  // ... other middlewares
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'your-s3-bucket.s3.amazonaws.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];

// Add health check route
// src/api/health/routes/health.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        auth: false,
      },
    },
  ],
};

// src/api/health/controllers/health.js
module.exports = {
  check: async (ctx) => {
    ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
  },
};
```

### Logging

Configure production logging:

```javascript
// config/logger.js
module.exports = {
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
};
```

### Backup Strategy

Set up regular backups:

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DATABASE_HOST -U $DATABASE_USERNAME $DATABASE_NAME > backup_$DATE.sql

# Upload to S3
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/database/

# Clean old backups (keep last 30 days)
find . -name "backup_*.sql" -mtime +30 -delete
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install

# Rebuild plugin
cd src/plugins/review-moderation
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### 2. Database Connection Issues

```bash
# Test database connection
npm run strapi console
strapi.db.connection.raw('SELECT 1+1 as result')
```

#### 3. Plugin Not Loading

```bash
# Check plugin build
ls -la src/plugins/review-moderation/dist/

# Check configuration
cat config/plugins.js
```

#### 4. File Upload Issues

```bash
# Check AWS credentials
aws sts get-caller-identity

# Test S3 connection
aws s3 ls s3://your-bucket-name
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_reviews_product ON reviews(product);
CREATE INDEX idx_reviews_approved ON reviews(approved);
```

#### 2. Caching

```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'your-cdn-domain.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Emergency Procedures

#### 1. Rollback Deployment

```bash
# Using Heroku
heroku rollback

# Using PM2
pm2 stop all
git checkout previous-stable-commit
npm run build
pm2 restart all
```

#### 2. Database Recovery

```bash
# Restore from backup
psql -h $DATABASE_HOST -U $DATABASE_USERNAME $DATABASE_NAME < backup_file.sql
```

## 📞 Support

For deployment issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review Strapi deployment documentation
3. Create an issue in the repository
4. Contact the development team

---

**Happy Deploying! 🚀**