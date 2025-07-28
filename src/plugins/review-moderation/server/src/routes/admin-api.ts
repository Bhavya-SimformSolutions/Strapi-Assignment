/**
 * Review Moderation Plugin Routes
 * These routes are accessible from the admin panel at: /admin/api/review-moderation/*
 * Simplified to use only admin routes (removed redundant content-api routes)
 */
export default [
  {
    method: 'GET',
    path: '/reviews',
    handler: 'controller.getAllReviews',
    config: {
      policies: [],
      auth: false, // We'll rely on Strapi's admin authentication
    },
  },
  {
    method: 'GET',
    path: '/reviews/stats',
    handler: 'controller.getReviewStats',
    config: {
      policies: [],
      auth: false, // We'll rely on Strapi's admin authentication
    },
  },
  {
    method: 'PUT',
    path: '/reviews/:id/approve',
    handler: 'controller.approveReview',
    config: {
      policies: [],
      auth: false, // We'll rely on Strapi's admin authentication
    },
  },
  {
    method: 'PUT',
    path: '/reviews/:id/reject',
    handler: 'controller.rejectReview',
    config: {
      policies: [],
      auth: false, // We'll rely on Strapi's admin authentication
    },
  },
];
