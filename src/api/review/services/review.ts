/**
 * Review service - validation is handled by Document Service Middleware
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::review.review' as any);
