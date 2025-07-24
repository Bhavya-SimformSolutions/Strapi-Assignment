/**
 * Document Service Middleware for banned word validation
 * Replaces lifecycle hooks in Strapi 5
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // List of banned words
    const bannedWords = ['test', 'spam', 'fake', 'badword'];
    
    // Only apply validation to review content type operations
    if (ctx.uid !== 'api::review.review') {
      return await next();
    }
    
    // Only validate create and update operations
    if (!['create', 'update'].includes(ctx.action)) {
      return await next();
    }
    
    console.log(`Document Service Middleware: ${ctx.action} operation on ${ctx.uid}`);
    console.log('Data:', ctx.params.data);
    
    // Check if comment contains banned words
    if (ctx.params.data?.comment) {
      const comment = ctx.params.data.comment;
      const commentLower = comment.toLowerCase();
      
      const foundBannedWord = bannedWords.find(word => 
        commentLower.includes(word.toLowerCase())
      );
      
      console.log('Comment being validated:', comment);
      console.log('Found banned word:', foundBannedWord);
      
      if (foundBannedWord) {
        console.log(`Blocking review ${ctx.action} due to banned word:`, foundBannedWord);
        
        const error = new Error(`Comment contains inappropriate content. Banned word detected: "${foundBannedWord}"`);
        error.name = 'ApplicationError';
        (error as any).status = 400;
        throw error;
      }
    }
    
    console.log('Document Service Middleware: Validation passed');
    
    // Continue to the next middleware or the actual operation
    return await next();
  };
};
