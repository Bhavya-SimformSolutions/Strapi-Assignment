/**
 * Review controller with custom validation
 * Rejects submissions containing banned words
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::review.review' as any, ({ strapi }) => ({
  // Override the create method to handle validation errors gracefully
  async create(ctx) {
    console.log('Custom review create method called');
    console.log('Request body:', ctx.request.body);
    
    try {
      console.log('Review validation and creation in progress');
      // Let the lifecycle hooks handle validation, then create the review
      const result = await super.create(ctx);
      return result;
    } catch (error) {
      if (error.name === 'ApplicationError' || error.name === 'ValidationError') {
        console.log('Validation error caught in controller:', error.message);
        return ctx.badRequest(error.message);
      }
      // Re-throw any other errors
      throw error;
    }
  },

  // Override the update method to handle validation errors gracefully
  async update(ctx) {
    console.log('Custom review update method called');
    
    try {
      console.log('Review update validation in progress');
      const result = await super.update(ctx);
      return result;
    } catch (error) {
      if (error.name === 'ApplicationError' || error.name === 'ValidationError') {
        console.log('Update validation error caught in controller:', error.message);
        return ctx.badRequest(error.message);
      }
      // Re-throw any other errors
      throw error;
    }
  },
}));
