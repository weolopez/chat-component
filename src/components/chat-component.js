/**
 * Main Chat Component
 */
import { getChatStyles } from '../styles/chat-styles.js';
import { ChatService } from '../services/chat-service.js';
import { ThemeService } from '../services/theme-service.js';
import { MemoryService } from '../services/memory-service.js';
import { renderChatHeader } from '../ui/chat-header.js';
import { renderChatSidebar } from '../ui/chat-sidebar.js';
import { renderChatInput } from '../ui/chat-input.js';
import { renderModelSelector } from '../ui/model-selector.js';
import { renderMemoryPanel } from '../ui/memory-panel.js';
import { renderLoadingContainer } from '../ui/loading-container.js';

class ChatComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clear any existing styles if element is reused
    if (this.shadowRoot.children.length > 0) {
      this.shadowRoot.innerHTML = '';
    }
    
    // Get brand attribute or default to AT&T
    this.brand = this.getAttribute('brand') || 'myTheme';
    
    // Initialize services
    this.initializeServices();
    
    // Process custom branding if provided
    this.processCustomBranding();
  }
  
  /**
   * Initialize component services
   */
  initializeServices() {
    this.themeService = new ThemeService(this, this.brand);
    this.chatService = new ChatService(this);
    this.memoryService = new MemoryService(this);
  }
  
  /**
   * Process custom branding attributes
   */
  processCustomBranding() {
    const customAttributes = {
      primaryColor: this.getAttribute('primary-color'),
      accentColor: this.getAttribute('accent-color'),
      borderRadius: this.getAttribute('border-radius'),
      fontFamily: this.getAttribute('font-family')
    };
    
    // Filter out undefined values
    const filteredAttributes = Object.fromEntries(
      Object.entries(customAttributes).filter(([_, v]) => v !== null)
    );
    
    if (Object.keys(filteredAttributes).length > 0) {
      this.themeService.processCustomBranding(filteredAttributes);
    }
  }

  /**
   * Web component lifecycle callback when component is added to DOM
   */
  async connectedCallback() {
    // Load AT&T font if using AT&T theme
    if (this.brand === 'myTheme') {
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    
    this.render();
    this.setupEventListeners();
    this.chatService.initWorker();
    this.themeService.changeTheme('myTheme');
    
    // Initialize memory and knowledge systems
    await this.memoryService.initialize();
  }
  
  /**
   * Render the component
   */
  render() {
    const styles = getChatStyles();
    
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="chat-container">
        ${renderChatSidebar()}
        <div class="chat-main">
          ${renderChatHeader(this)}
          ${renderModelSelector(this.chatService.availableModels, this.chatService.selectedModel)}
          <div class="messages">
            <!-- Will be populated dynamically -->
          </div>
          ${renderChatInput()}
          ${renderMemoryPanel()}
          ${renderLoadingContainer()}
        </div>
      </div>
    `;
  }
  
  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const input = this.shadowRoot.querySelector('.message-input');
    const themeToggle = this.shadowRoot.querySelector('.theme-toggle');
    const sidebarToggle = this.shadowRoot.querySelector('.sidebar-toggle');
    const modelSelector = this.shadowRoot.querySelector('.model-selector');
    const clearButton = this.shadowRoot.querySelector('.clear-chat');
    const themeSelector = this.shadowRoot.querySelector('.theme-selector');
    const memoryToggle = this.shadowRoot.querySelector('.memory-toggle');
    
    // Form submission (send message)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      
      if (message && !this.chatService.isProcessing && this.chatService.modelLoaded) {
        this.chatService.sendMessage(message);
        input.value = '';
        
        // Reset typing indicator styles
        if (this.chatService.typingTimeout) {
          clearTimeout(this.chatService.typingTimeout);
        }
        input.classList.remove('is-typing');
      }
    });

    // Enhanced input with typing events
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        form.dispatchEvent(new Event('submit'));
      } else {
        // Show typing indicator
        input.classList.add('is-typing');
        
        // Clear previous timeout
        if (this.chatService.typingTimeout) {
          clearTimeout(this.chatService.typingTimeout);
        }
        
        // Set new timeout
        this.chatService.typingTimeout = setTimeout(() => {
          input.classList.remove('is-typing');
        }, 1000);
      }
    });
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.themeService.cycleTheme();
        
        // Update theme selector if available
        if (themeSelector) {
          themeSelector.value = this.themeService.theme;
        }
      });
    }
    
    // Theme selector
    if (themeSelector) {
      // Set current theme
      themeSelector.value = this.themeService.theme;
      
      // Add change event listener
      themeSelector.addEventListener('change', (e) => {
        this.themeService.changeTheme(e.target.value);
      });
    }
    
    // Sidebar toggle for mobile
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        const container = this.shadowRoot.querySelector('.chat-container');
        container.classList.toggle('sidebar-open');
      });
    }
    
    // Model selector
    if (modelSelector) {
      modelSelector.addEventListener('change', (e) => {
        this.chatService.changeModel(e.target.value);
      });
    }
    
    // Clear chat button
    if (clearButton) {
      clearButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear the current chat and memory?')) {
          this.chatService.messages = [];
          this.chatService.renderMessages();
          this.chatService.saveChatHistory();
          
          // Clear memory if available
          await this.memoryService.clearMemory();
        }
      });
    }
    
    // Memory toggle button
    if (memoryToggle) {
      memoryToggle.addEventListener('click', async () => {
        const memoryPanel = this.shadowRoot.querySelector('.memory-panel');
        
        if (!memoryPanel.classList.contains('active')) {
          // Open memory panel
          memoryPanel.classList.add('active');
          
          // Update memory status display
          await this.memoryService.updateMemoryPanel();
        } else {
          // Close memory panel
          memoryPanel.classList.remove('active');
        }
      });
      
      // Close memory panel button
      const closeMemoryBtn = this.shadowRoot.querySelector('.close-memory');
      if (closeMemoryBtn) {
        closeMemoryBtn.addEventListener('click', () => {
          const memoryPanel = this.shadowRoot.querySelector('.memory-panel');
          memoryPanel.classList.remove('active');
        });
      }
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const container = this.shadowRoot.querySelector('.chat-container');
        const sidebar = this.shadowRoot.querySelector('.chat-sidebar');
        const sidebarBtn = this.shadowRoot.querySelector('.sidebar-toggle');
        
        // Check if click was outside sidebar and not on the toggle button
        if (container && container.classList.contains('sidebar-open') && 
            sidebar && !sidebar.contains(e.target) && 
            sidebarBtn && !sidebarBtn.contains(e.target)) {
          container.classList.remove('sidebar-open');
        }
      }
    });
  }
  
  /**
   * Getter for memory manager
   */
  get memoryManager() {
    return this.memoryService.memoryManager;
  }
  
  /**
   * Getter for knowledge loader
   */
  get knowledgeLoader() {
    return this.memoryService.knowledgeLoader;
  }
  
  /**
   * Getter for memory initialized status
   */
  get memoryInitialized() {
    return this.memoryService.memoryInitialized;
  }
  
  /**
   * Getter for knowledge initialized status
   */
  get knowledgeInitialized() {
    return this.memoryService.knowledgeInitialized;
  }
}

// Register the web component
customElements.define('chat-component', ChatComponent);

export default ChatComponent;