/**
 * Review Moderation API Routes
 * These are like Angular routes but for backend API endpoints
 * They will be accessible at: /api/review-moderation/[path]
 */
export default [
  {
    method: 'GET',
    path: '/reviews',
    handler: 'controller.getAllReviews',
    config: {
      policies: [],
      auth: {
        scope: ['admin']  // Only admin users can access
      }
    },
  },
  {
    method: 'PUT',
    path: '/reviews/:id/approve',
    handler: 'controller.approveReview',
    config: {
      policies: [],
      auth: {
        scope: ['admin']  // Only admin users can approve
      }
    },
  },
  {
    method: 'PUT',
    path: '/reviews/:id/reject',
    handler: 'controller.rejectReview',
    config: {
      policies: [],
      auth: {
        scope: ['admin']  // Only admin users can reject
      }
    },
  },
];
