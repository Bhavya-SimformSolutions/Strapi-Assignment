import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get all reviews for moderation
   * This is like a GET endpoint in Angular HTTP service
   */
  async getAllReviews(ctx) {
    try {
      // Call our service to get reviews
      const reviews = await strapi
        .plugin('review-moderation')
        .service('reviewService')
        .getAllReviews();
      
      ctx.body = {
        data: reviews,
        message: 'Reviews fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      ctx.throw(500, 'Failed to fetch reviews');
    }
  },

  /**
   * Approve a review
   * Similar to Angular HTTP PUT/PATCH request
   */
  async approveReview(ctx) {
    try {
      const { id } = ctx.params;
      
      const updatedReview = await strapi
        .plugin('review-moderation')
        .service('reviewService')
        .approveReview(id);
      
      ctx.body = {
        data: updatedReview,
        message: 'Review approved successfully'
      };
    } catch (error) {
      console.error('Error approving review:', error);
      ctx.throw(500, 'Failed to approve review');
    }
  },

  /**
   * Reject a review
   * Similar to Angular HTTP PUT/PATCH request
   */
  async rejectReview(ctx) {
    try {
      const { id } = ctx.params;
      
      const updatedReview = await strapi
        .plugin('review-moderation')
        .service('reviewService')
        .rejectReview(id);
      
      ctx.body = {
        data: updatedReview,
        message: 'Review rejected successfully'
      };
    } catch (error) {
      console.error('Error rejecting review:', error);
      ctx.throw(500, 'Failed to reject review');
    }
  },
});

export default controller;
