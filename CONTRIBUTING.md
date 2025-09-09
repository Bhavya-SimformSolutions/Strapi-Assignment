# 🤝 Contributing to Product Catalog CMS

Thank you for your interest in contributing to the Product Catalog CMS! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **npm** 6.x or higher
- **Git** for version control
- A code editor (VS Code recommended)
- Basic knowledge of:
  - TypeScript/JavaScript
  - Strapi framework
  - REST APIs
  - React (for admin interface)

### Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Strapi-Assignment.git
   cd Strapi-Assignment
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Bhavya-SimformSolutions/Strapi-Assignment.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Build the review moderation plugin**:
   ```bash
   cd src/plugins/review-moderation
   npm install
   npm run build
   cd ../../..
   ```

6. **Set up environment**:
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

7. **Start development server**:
   ```bash
   npm run develop
   ```

## 💻 Development Setup

### Project Structure

```
├── config/                 # Strapi configuration
├── database/              # Database files (SQLite)
├── docs/                  # Documentation
├── public/                # Static assets
├── src/
│   ├── admin/            # Admin panel customizations
│   ├── api/              # API endpoints
│   │   ├── category/     # Category content type
│   │   ├── product/      # Product content type
│   │   └── review/       # Review content type
│   ├── extensions/       # Core extensions
│   └── plugins/
│       └── review-moderation/  # Custom plugin
├── types/                # TypeScript definitions
├── .env.example         # Environment template
├── package.json
└── README.md
```

### Plugin Development

The review moderation plugin has its own development workflow:

```bash
cd src/plugins/review-moderation

# Install plugin dependencies
npm install

# Development with watch mode
npm run watch

# Build for production
npm run build

# TypeScript checks
npm run test:ts:back   # Backend
npm run test:ts:front  # Frontend
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

1. **Bug fixes** - Fix existing issues
2. **Feature enhancements** - Improve existing features
3. **New features** - Add new functionality
4. **Documentation** - Improve or add documentation
5. **Performance improvements** - Optimize existing code
6. **Test coverage** - Add or improve tests

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for major changes to discuss the approach
3. **Fork and branch** from the latest `main` branch
4. **Keep changes focused** - one feature/fix per PR

### Branch Naming

Use descriptive branch names:

```bash
# Feature branches
feature/add-product-search
feature/improve-review-validation

# Bug fix branches
fix/review-approval-error
fix/category-deletion-issue

# Documentation branches
docs/api-documentation
docs/setup-instructions
```

## 🔧 Code Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for data structures
- **Add type annotations** for function parameters and return types
- **Avoid `any` type** when possible

**Example:**
```typescript
// Good
interface ReviewData {
  reviewer_name: string;
  rating: number;
  comment: string;
  product: number;
}

const createReview = async (data: ReviewData): Promise<Review> => {
  // Implementation
};

// Avoid
const createReview = async (data: any): Promise<any> => {
  // Implementation
};
```

### JavaScript/TypeScript Style

- **Use ESLint** for code linting
- **Use Prettier** for code formatting
- **Follow camelCase** for variables and functions
- **Use PascalCase** for classes and interfaces
- **Use UPPER_SNAKE_CASE** for constants

### API Design

- **Follow REST conventions**
- **Use consistent response formats**
- **Include proper error handling**
- **Add input validation**
- **Document new endpoints**

**Example:**
```typescript
// Good API endpoint
export default {
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Validate input
      if (!data.name || !data.price) {
        return ctx.badRequest('Name and price are required');
      }
      
      const product = await strapi.db.query('api::product.product').create({
        data
      });
      
      ctx.body = { data: product };
    } catch (error) {
      ctx.throw(500, 'Failed to create product');
    }
  }
};
```

### Plugin Development Standards

- **Follow Strapi plugin structure**
- **Use TypeScript for all plugin code**
- **Include comprehensive error handling**
- **Add JSDoc comments for public methods**
- **Build before committing**

## 🧪 Testing

### Running Tests

Currently, the project uses TypeScript compilation as a form of testing:

```bash
# Main project TypeScript check
npx tsc --noEmit

# Plugin TypeScript checks
cd src/plugins/review-moderation
npm run test:ts:back
npm run test:ts:front
```

### Manual Testing

Before submitting changes, manually test:

1. **Admin panel functionality**
   - Login and navigation
   - Content type operations
   - Plugin functionality

2. **API endpoints**
   - CRUD operations
   - Authentication
   - Error handling

3. **Review moderation workflow**
   - Submit reviews
   - Approve/reject reviews
   - Statistics display

### Testing Checklist

- [ ] TypeScript compilation passes
- [ ] Admin panel loads without errors
- [ ] API endpoints respond correctly
- [ ] Plugin builds successfully
- [ ] No console errors
- [ ] Changes work in both development and production builds

## 📥 Pull Request Process

### 1. Prepare Your Changes

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Build and test
npm run build
cd src/plugins/review-moderation && npm run build
```

### 2. Commit Guidelines

Use conventional commit messages:

```bash
# Format: type(scope): description

# Examples:
git commit -m "feat(product): add search functionality"
git commit -m "fix(review): resolve approval notification issue"
git commit -m "docs(api): add endpoint documentation"
git commit -m "refactor(plugin): improve error handling"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 3. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### 4. PR Requirements

Your pull request must:

- [ ] **Pass TypeScript compilation**
- [ ] **Include clear description** of changes
- [ ] **Reference related issues** (if applicable)
- [ ] **Update documentation** (if needed)
- [ ] **Follow code standards**
- [ ] **Build successfully**

### 5. PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] TypeScript compilation passes
- [ ] Manual testing completed
- [ ] Admin panel tested
- [ ] API endpoints tested

## Related Issues
Closes #123

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Environment information**:
   - Node.js version
   - npm version
   - OS and version
   - Browser (for admin issues)

2. **Steps to reproduce**:
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Additional context**:
   - Screenshots/videos
   - Error messages
   - Console logs

### Feature Requests

For feature requests, provide:

1. **Problem description** - What problem does this solve?
2. **Proposed solution** - How should it work?
3. **Alternatives considered** - Other approaches you've thought of
4. **Use cases** - Specific scenarios where this would be helpful

### Issue Template

```markdown
## Bug Report / Feature Request

### Environment
- Node.js version: [e.g., 18.17.0]
- npm version: [e.g., 9.6.7]
- OS: [e.g., macOS 13.4]
- Browser: [e.g., Chrome 114] (if applicable)

### Description
[Clear description of the issue or feature request]

### Steps to Reproduce (for bugs)
1. Step one
2. Step two
3. Step three

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[If applicable, add screenshots]

### Additional Context
[Any other context about the problem]
```

## 🏷️ Labels and Milestones

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `plugin` - Related to the review moderation plugin
- `api` - Related to API endpoints
- `admin` - Related to admin panel

### Priority Labels

- `priority: low` - Nice to have
- `priority: medium` - Should be addressed
- `priority: high` - Important issue
- `priority: critical` - Urgent fix needed

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** - Contributor list
- **CHANGELOG.md** - Release notes
- **GitHub releases** - Release acknowledgments

## 📞 Getting Help

If you need help with contributing:

1. **Check the documentation** - README, API docs, plugin docs
2. **Search existing issues** - Your question might be answered
3. **Create a discussion** - For general questions
4. **Join the community** - Strapi Discord server

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Product Catalog CMS! 🚀