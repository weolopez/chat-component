/**
 * Memory service for managing conversation memory and knowledge retrieval
 */
export class MemoryService {
  constructor(component) {
    this.component = component;
    this.memoryManager = null;
    this.knowledgeLoader = null;
    this.memoryInitialized = false;
    this.knowledgeInitialized = false;
  }

  /**
   * Initialize memory and knowledge systems
   */
  async initialize() {
    try {
      // Dynamically import memory and knowledge components
      const [MemoryManagerModule, KnowledgeLoaderModule] = await Promise.all([
        import('../../lib/memory-manager.js'),
        import('../../lib/knowledge-loader.js')
      ]);
      
      // Initialize memory manager
      const { MemoryManager } = MemoryManagerModule;
      this.memoryManager = new MemoryManager({
        historySize: 20,
        useLocalStorage: true,
        binarize: false // Use standard vector embeddings (not binary)
      });
      this.memoryInitialized = true;
      
      // Initialize knowledge base
      const { KnowledgeLoader } = KnowledgeLoaderModule;
      this.knowledgeLoader = new KnowledgeLoader({
        directoryPath: './knowledge/',
        binarize: false 
      });
      
      // Load knowledge base from markdown files
      this.knowledgeLoader.loadKnowledgeBase()
        .then(results => {
          console.log(`Loaded ${results.filter(r => r.success).length} knowledge files`);
          this.knowledgeInitialized = true;
        })
        .catch(error => {
          console.error('Error loading knowledge base:', error);
        });
        
      console.log('Memory and knowledge systems initialized');
    } catch (error) {
      console.error('Error initializing memory systems:', error);
    }
  }

  /**
   * Update the memory panel UI
   */
  async updateMemoryPanel() {
    if (!this.memoryInitialized || !this.memoryManager) {
      console.warn('Memory not initialized');
      return;
    }
    
    const memoryContent = this.component.shadowRoot.querySelector('.memory-content');
    const memoryStats = this.component.shadowRoot.querySelector('.memory-stats');
    
    if (!memoryContent || !memoryStats) {
      return;
    }
    
    try {
      // Get recent messages
      const recentMessages = this.memoryManager.getRecentMessages(5);
      
      // Get stats
      const allMemories = await this.memoryManager.db.getAll();
      const recentCount = recentMessages.length;
      const totalCount = allMemories.length;
      
      // Update stats
      if (memoryStats) {
        const recentCountEl = memoryStats.querySelector('#recentCount');
        const totalCountEl = memoryStats.querySelector('#totalCount');
        
        if (recentCountEl) recentCountEl.textContent = recentCount;
        if (totalCountEl) totalCountEl.textContent = totalCount;
      }
      
      // Clear memory content
      memoryContent.innerHTML = '';
      
      // No context case
      if (recentCount === 0 && totalCount === 0) {
        memoryContent.innerHTML = '<p>No context has been sent to the AI yet. Send a message to see what context is used.</p>';
        return;
      }
      
      // Create section for recent conversation history
      if (recentCount > 0) {
        const historySection = document.createElement('div');
        historySection.className = 'memory-item';
        
        let historyContent = `
          <div class="memory-item-header">
            <span>Recent Conversation History</span>
          </div>
          <div class="memory-item-text" style="white-space: pre-line;">
        `;
        
        recentMessages.forEach(msg => {
          historyContent += `${msg.role}: ${msg.content}\n`;
        });
        
        historyContent += `</div>`;
        historySection.innerHTML = historyContent;
        memoryContent.appendChild(historySection);
      }
      
      // Create section for knowledge base if available
      if (this.knowledgeInitialized && this.knowledgeLoader) {
        const knowledgeSection = document.createElement('div');
        knowledgeSection.className = 'memory-item';
        knowledgeSection.innerHTML = `
          <div class="memory-item-header">
            <span>Knowledge Base</span>
          </div>
          <div class="memory-item-text">
            <p>Knowledge base is loaded. When you ask a question, relevant information will be retrieved.</p>
          </div>
        `;
        memoryContent.appendChild(knowledgeSection);
      }
      
    } catch (error) {
      console.error('Error updating memory panel:', error);
      memoryContent.innerHTML = '<p>Error displaying memory information.</p>';
    }
  }

  /**
   * Clear all memory
   */
  async clearMemory() {
    if (this.memoryInitialized && this.memoryManager) {
      try {
        await this.memoryManager.clearMemory();
        console.log('Memory cleared');
      } catch (error) {
        console.error('Error clearing memory:', error);
      }
    }
  }
}