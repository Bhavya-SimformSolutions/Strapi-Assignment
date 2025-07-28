import type { Core } from '@strapi/strapi';

/**
 * Review service for moderation operations
 * This is like an Angular service with business logic methods
 */
const reviewService = ({ strapi }: { strapi: Core.Strapi }) => ({
  
  /**
   * Get all reviews with related product information
   * Updated to use Document Service (Strapi 5 recommended approach)
   */
  async getAllReviews() {
    try {
      // Use Document Service to get ALL reviews regardless of draft/publish status
      // This maintains the same behavior as the old Entity Service approach
      const [publishedReviews, draftReviews] = await Promise.all([
        // Get published reviews
        strapi.documents('api::review.review').findMany({
          populate: { product: true },
          sort: { createdAt: 'desc' },
          status: 'published'
        }).catch(() => []), // Return empty array if no published reviews
        
        // Get draft reviews
        strapi.documents('api::review.review').findMany({
          populate: { product: true },
          sort: { createdAt: 'desc' },
          status: 'draft'
        }).catch(() => []) // Return empty array if no draft reviews
      ]);
      
      // Combine all reviews and sort by creation date (newest first)
      const allReviews = [...publishedReviews, ...draftReviews].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return allReviews;
      
    } catch (error) {
      console.error('ReviewService: Error fetching reviews:', error);
      // Fallback: try without status filter (similar to old Entity Service behavior)
      try {
        const reviews = await strapi.documents('api::review.review').findMany({
          populate: { product: true },
          sort: { createdAt: 'desc' }
          // No status filter - gets all reviews regardless of publish state
        });
        return reviews;
      } catch (fallbackError) {
        console.error('ReviewService: Fallback also failed:', fallbackError);
        throw error;
      }
    }
  },

  /**
   * Approve a review by setting approved = true
   * Updated to use Document Service (Strapi 5 recommended approach)
   */
  async approveReview(reviewId: string) {
    try {
      const updatedReview = await strapi.documents('api::review.review').update({
        documentId: reviewId,
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
   * Updated to use Document Service (Strapi 5 recommended approach)
   */
  async rejectReview(reviewId: string) {
    try {
      const updatedReview = await strapi.documents('api::review.review').update({
        documentId: reviewId,
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
   * Updated to use Document Service but maintains backward compatibility
   */
  async getReviewStats() {
    try {
      // Count all reviews regardless of draft/publish status (like Entity Service did)
      const [publishedStats, draftStats] = await Promise.all([
        // Count published reviews
        Promise.all([
          strapi.documents('api::review.review').count({ status: 'published' }).catch(() => 0),
          strapi.documents('api::review.review').count({ 
            filters: { approved: true }, 
            status: 'published' 
          }).catch(() => 0),
          strapi.documents('api::review.review').count({ 
            filters: { approved: false }, 
            status: 'published' 
          }).catch(() => 0)
        ]),
        // Count draft reviews
        Promise.all([
          strapi.documents('api::review.review').count({ status: 'draft' }).catch(() => 0),
          strapi.documents('api::review.review').count({ 
            filters: { approved: true }, 
            status: 'draft' 
          }).catch(() => 0),
          strapi.documents('api::review.review').count({ 
            filters: { approved: false }, 
            status: 'draft' 
          }).catch(() => 0)
        ])
      ]);
      
      const [totalPublished, approvedPublished, pendingPublished] = publishedStats;
      const [totalDraft, approvedDraft, pendingDraft] = draftStats;
      
      return {
        total: totalPublished + totalDraft,
        approved: approvedPublished + approvedDraft,
        pending: pendingPublished + pendingDraft
      };
      
    } catch (error) {
      console.error('ReviewService: Error getting stats:', error);
      // Fallback: try without status filter (Entity Service style)
      try {
        const totalReviews = await strapi.documents('api::review.review').count({});
        const approvedReviews = await strapi.documents('api::review.review').count({
          filters: { approved: true }
        });
        const pendingReviews = await strapi.documents('api::review.review').count({
          filters: { approved: false }
        });
        
        return {
          total: totalReviews,
          approved: approvedReviews,
          pending: pendingReviews
        };
      } catch (fallbackError) {
        console.error('ReviewService: Fallback stats also failed:', fallbackError);
        throw error;
      }
    }
  }
});

export default reviewService;
