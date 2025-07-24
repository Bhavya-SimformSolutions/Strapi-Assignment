/**
 * Admin API Routes for Review Moderation Plugin
 * These routes are accessible from the admin panel
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
