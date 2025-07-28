export default ({ env }) => ({
  // AWS S3 Upload Provider Configuration
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION'),
          params: {
            ACL: 'public-read',
            signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('AWS_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  
  // Review Moderation Plugin
  'review-moderation': {
    enabled: true,
    resolve: './src/plugins/review-moderation'
  },
  
  // Documentation Plugin
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Product Catalog API Documentation',
        description: 'API documentation for the Product Catalog CMS',
      },
      'x-strapi-config': {
        path: '/documentation',
        showGeneratedFiles: true,
        generateDefaultResponse: true,
      },
    },
  },
});
