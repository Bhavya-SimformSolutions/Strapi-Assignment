/**
 * Review lifecycle hooks for banned word validation
 */

export default {
  async beforeCreate(event) {
    console.log('Lifecycle beforeCreate called with event:', event);
    
    const { data } = event.params;
    
    // List of banned words
    const bannedWords = ['test', 'spam', 'fake', 'badword'];
    
    // Check if comment contains banned words
    if (data.comment) {
      const commentLower = data.comment.toLowerCase();
      const foundBannedWord = bannedWords.find(word => 
        commentLower.includes(word.toLowerCase())
      );
      
      console.log('Comment being checked:', data.comment);
      console.log('Found banned word:', foundBannedWord);
      
      if (foundBannedWord) {
        console.log('Blocking review creation due to banned word:', foundBannedWord);
        const error = new Error(`Comment contains inappropriate content. Banned word detected: "${foundBannedWord}"`);
        error.name = 'ApplicationError';
        (error as any).status = 400;
        throw error;
      }
    }
    
    console.log('Lifecycle validation passed');
  },

  async beforeUpdate(event) {
    console.log('Lifecycle beforeUpdate called with event:', event);
    
    const { data } = event.params;
    
    // List of banned words
    const bannedWords = ['test', 'spam', 'fake', 'badword'];
    
    // Check if comment contains banned words (only if comment is being updated)
    if (data.comment) {
      const commentLower = data.comment.toLowerCase();
      const foundBannedWord = bannedWords.find(word => 
        commentLower.includes(word.toLowerCase())
      );
      
      console.log('Comment being updated:', data.comment);
      console.log('Found banned word:', foundBannedWord);
      
      if (foundBannedWord) {
        console.log('Blocking review update due to banned word:', foundBannedWord);
        const error = new Error(`Comment contains inappropriate content. Banned word detected: "${foundBannedWord}"`);
        error.name = 'ApplicationError';
        (error as any).status = 400;
        throw error;
      }
    }
    
    console.log('Lifecycle update validation passed');
  }
};
