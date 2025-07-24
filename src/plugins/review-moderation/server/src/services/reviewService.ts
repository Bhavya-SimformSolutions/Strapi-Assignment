import type { Core } from '@strapi/strapi';

/**
 * Review service for moderation operations
 * This is like an Angular service with business logic methods
 */
const reviewService = ({ strapi }: { strapi: Core.Strapi }) => ({
  
  /**
   * Get all reviews with related product information
   * Similar to Angular service method that calls HTTP client
   */
  async getAllReviews() {
    try {
      // Use Strapi's entity service to get reviews with populated relations
      // This is like using Angular HttpClient to get data
      const reviews = await strapi.entityService.findMany('api::review.review' as any, {
        populate: {
          product: true  // Get all product fields
        },
        sort: { createdAt: 'desc' },  // Latest reviews first
      });
      
      return reviews;
      
    } catch (error) {
      console.error('ReviewService: Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Approve a review by setting approved = true
   * Like an Angular service method for updating data
   */
  async approveReview(reviewId: string) {
    try {
      // Update the review using Strapi's entity service
      const updatedReview = await strapi.entityService.update('api::review.review' as any, reviewId, {
        data: {
          approved: true
        } as any,
        populate: {
          product: true
        }
      });
      
      return updatedReview;
      
    } catch (error) {
      console.error(`ReviewService: Error approving review ${reviewId}:`, error);
      throw error;
    }
  },

  /**
   * Reject a review by setting approved = false
   * Like an Angular service method for updating data
   */
  async rejectReview(reviewId: string) {
    try {
      // Update the review using Strapi's entity service
      const updatedReview = await strapi.entityService.update('api::review.review' as any, reviewId, {
        data: {
          approved: false
        } as any,
        populate: {
          product: true
        }
      });
      
      return updatedReview;
      
    } catch (error) {
      console.error(`ReviewService: Error rejecting review ${reviewId}:`, error);
      throw error;
    }
  },

  /**
   * Get review statistics for dashboard
   * Like an Angular service method for analytics data
   */
  async getReviewStats() {
    try {
      const totalReviews = await strapi.entityService.count('api::review.review' as any);
      const approvedReviews = await strapi.entityService.count('api::review.review' as any, {
        filters: { approved: true }
      });
      const pendingReviews = await strapi.entityService.count('api::review.review' as any, {
        filters: { approved: false }
      });
      
      return {
        total: totalReviews,
        approved: approvedReviews,
        pending: pendingReviews
      };
      
    } catch (error) {
      console.error('ReviewService: Error getting stats:', error);
      throw error;
    }
  }
});

export default reviewService;
