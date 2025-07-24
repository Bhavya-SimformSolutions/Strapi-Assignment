/**
 * Review service - validation is handled by lifecycle hooks
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::review.review' as any);
