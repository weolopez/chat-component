/**
 * MemoryManager - Handles chat memory, context building, and knowledge integration
 */
export class MemoryManager {
  constructor(options = {}) {
    this.memoryManager = null;
    this.knowledgeLoader = null;
    this.memoryInitialized = false;
    this.knowledgeInitialized = false;
    this.options = {
      historySize: options.historySize || 20,
      useLocalStorage: options.useLocalStorage !== false,
      binarize: options.binarize || false,
      knowledgeDirectory: options.knowledgeDirectory || './knowledge/'
    };
  }

  /**
   * Initialize memory and knowledge systems
   */
  async initialize() {
    try {
      // Dynamically import memory and knowledge components
      const [MemoryManagerModule, KnowledgeLoaderModule] = await Promise.all([
        import('../lib/memory-manager.js'),
        import('../lib/knowledge-loader.js')
      ]);
      
      // Initialize memory manager
      const { MemoryManager } = MemoryManagerModule;
      this.memoryManager = new MemoryManager({
        historySize: this.options.historySize,
        useLocalStorage: this.options.useLocalStorage,
        binarize: this.options.binarize
      });
      this.memoryInitialized = true;
      
      // Initialize knowledge base
      const { KnowledgeLoader } = KnowledgeLoaderModule;
      this.knowledgeLoader = new KnowledgeLoader({
        directoryPath: this.options.knowledgeDirectory,
        binarize: this.options.binarize 
      });
      
      // Load knowledge base from markdown files
      const results = await this.knowledgeLoader.loadKnowledgeBase();
      console.log(`Loaded ${results.filter(r => r.success).length} knowledge files`);
      this.knowledgeInitialized = true;
      
      console.log('Memory and knowledge systems initialized');
      return true;
    } catch (error) {
      console.error('Error initializing memory systems:', error);
      return false;
    }
  }

  /**
   * Add a message to memory
   * @param {Object} message - The message to add to memory
   */
  async addMessage(message) {
    if (!this.memoryInitialized || !this.memoryManager) {
      return false;
    }
    
    try {
      await this.memoryManager.addMessage(message);
      return true;
    } catch (error) {
      console.error('Error adding message to memory:', error);
      return false;
    }
  }

  /**
   * Build context for a message using memory and knowledge
   * @param {string} content - The message content to build context for
   */
  async buildContext(content) {
    if (!this.memoryInitialized || !this.memoryManager) {
      return {};
    }
    
    try {
      // Get context from memory
      const context = await this.memoryManager.buildContext(content);
      
      // Search knowledge base if available
      let knowledgeResults = [];
      if (this.knowledgeInitialized && this.knowledgeLoader) {
        knowledgeResults = await this.knowledgeLoader.query(content, 3);
      }
      
      // Format context as messages for the LLM
      const messageContext = this.memoryManager.formatContextMessages(context, content);
      
      // Add knowledge to the context if available
      if (knowledgeResults && knowledgeResults.length > 0) {
        // Add knowledge to the system message
        let knowledgeContext = "I've found some relevant information that might help answer the question:\n\n";
        
        knowledgeResults.forEach((result, index) => {
          knowledgeContext += `[${index + 1}] From ${result.document?.title || 'documentation'}:\n${result.text}\n\n`;
        });
        
        // Add or update system message with knowledge
        if (messageContext.length > 0 && messageContext[0].role === 'system') {
          messageContext[0].content += '\n\n' + knowledgeContext;
        } else {
          messageContext.unshift({
            role: 'system',
            content: knowledgeContext
          });
        }
      }
      
      return messageContext;
    } catch (error) {
      console.error('Error building context:', error);
      return [];
    }
  }

  /**
   * Clear all memory
   */
  async clearMemory() {
    if (!this.memoryInitialized || !this.memoryManager) {
      return false;
    }
    
    try {
      await this.memoryManager.clearMemory();
      return true;
    } catch (error) {
      console.error('Error clearing memory:', error);
      return false;
    }
  }

  /**
   * Get recent messages from memory
   * @param {number} count - The number of recent messages to retrieve
   */
  getRecentMessages(count = 5) {
    if (!this.memoryInitialized || !this.memoryManager) {
      return [];
    }
    
    return this.memoryManager.getRecentMessages(count);
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats() {
    if (!this.memoryInitialized || !this.memoryManager) {
      return { recent: 0, total: 0 };
    }
    
    try {
      const recentMessages = this.memoryManager.getRecentMessages(5);
      const allMemories = await this.memoryManager.db.getAll();
      
      return {
        recent: recentMessages.length,
        total: allMemories.length
      };
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return { recent: 0, total: 0 };
    }
  }
}