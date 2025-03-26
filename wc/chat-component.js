import { ChatEngine } from '../js/chat-engine.js';
import { MemoryManager } from '../js/memory-manager.js';
import { ChatHistory } from '../js/chat-history.js';
import { ThemeManager } from '../js/theme-manager.js';
import * as Utils from '../js/utils.js';
import * as UI from './chat-ui.js';
import * as ChatFunctions from './chat-functionality.js';
import { getTemplate } from './chat-template.js';
import { getStyles } from './chat-styles.js';

/**
 * ChatComponent - Web component for chat UI
 * This component handles the UI rendering and user interactions,
 * while delegating the actual chat functionality to the imported modules.
 */
class ChatComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Clear any existing styles if element is reused
    if (this.shadowRoot.children.length > 0) {
      this.shadowRoot.innerHTML = '';
    }
    
    // Initialize state
    this.isProcessing = false;
    this.typingTimeout = null;
    
    // Get brand attribute or default to AT&T
    this.brand = this.getAttribute('brand') || 'att';
    
    // Get custom branding attributes
    const customBranding = {};
    if (this.hasAttribute('primary-color')) {
      customBranding.primaryColor = this.getAttribute('primary-color');
    }
    if (this.hasAttribute('accent-color')) {
      customBranding.accentColor = this.getAttribute('accent-color');
    }
    if (this.hasAttribute('border-radius')) {
      customBranding.borderRadius = this.getAttribute('border-radius');
    }
    if (this.hasAttribute('font-family')) {
      customBranding.fontFamily = this.getAttribute('font-family');
    }
    
    // Initialize theme manager
    this.themeManager = new ThemeManager({
      brand: this.brand,
      customBranding
    });
    
    // Initialize chat history
    this.chatHistoryManager = new ChatHistory();
    this.messages = this.chatHistoryManager.getMessages();
    
    // Initialize model options
    this.availableModels = [
      { id: "Qwen2.5-0.5B-Instruct-q0f16-MLC", name: "Qwen 0.5B (Fast)" },
      { id: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC", name: "DeepSeek 7B (Smart)" }
    ];
    this.selectedModel = "Qwen2.5-0.5B-Instruct-q0f16-MLC";
    
    // Make Utils available to the UI methods
    this.Utils = Utils;
  }

  async connectedCallback() {
    // Load AT&T font if using AT&T theme
    if (this.brand === 'att') {
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    
    // Render the component
    this.render();
    
    // Apply theme
    this.setupTheme();
    
    // Initialize chat engine
    this.chatEngine = new ChatEngine({
      selectedModel: this.selectedModel,
      availableModels: this.availableModels,
      onInitProgress: this.updateProgress.bind(this),
      onInitComplete: this.handleModelLoaded.bind(this),
      onResponseChunk: this.updateResponse.bind(this),
      onResponseComplete: this.completeResponse.bind(this),
      onError: this.handleError.bind(this),
      onStatusUpdate: this.updateStatus.bind(this)
    });
    this.chatEngine.initWorker();
    
    // Initialize memory manager
    this.memoryManager = new MemoryManager({
      historySize: 20,
      useLocalStorage: true,
      binarize: false,
      knowledgeDirectory: './knowledge/'
    });
    this.memoryManager.initialize()
      .then(() => {
        console.log('Memory and knowledge systems initialized');
      })
      .catch(error => {
        console.error('Error initializing memory systems:', error);
      });
    
    // Setup event listeners
    this.setupEventListeners();
  }

  // Import UI methods
  setupTheme = UI.setupTheme;
  updateProgress = UI.updateProgress;
  handleModelLoaded = UI.handleModelLoaded;
  updateStatus = UI.updateStatus;
  updateResponse = UI.updateResponse;
  showTypingIndicator = UI.showTypingIndicator;
  disableInput = UI.disableInput;
  enableInput = UI.enableInput;
  scrollToBottom = UI.scrollToBottom;
  setupCopyButtons = UI.setupCopyButtons;
  setupFeedbackButtons = UI.setupFeedbackButtons;
  renderMessages = UI.renderMessages;
  updateMemoryPanel = UI.updateMemoryPanel;
  renderChatSidebar = UI.renderChatSidebar;
  
  // Import chat functionality methods
  completeResponse = ChatFunctions.completeResponse;
  handleError = ChatFunctions.handleError;
  sendMessage = ChatFunctions.sendMessage;
  
  // Setup event listeners
  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const input = this.shadowRoot.querySelector('.message-input');
    const themeToggle = this.shadowRoot.querySelector('.theme-toggle');
    const sidebarToggle = this.shadowRoot.querySelector('.sidebar-toggle');
    const modelSelector = this.shadowRoot.querySelector('.model-selector');
    const clearButton = this.shadowRoot.querySelector('.clear-chat');
    const themeSelector = this.shadowRoot.querySelector('.theme-selector');
    const memoryToggle = this.shadowRoot.querySelector('.memory-toggle');
    
    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      
      if (message && !this.isProcessing) {
        this.sendMessage(message);
        input.value = '';
        
        // Reset typing indicator styles
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
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
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        
        // Set new timeout
        this.typingTimeout = setTimeout(() => {
          input.classList.remove('is-typing');
        }, 1000);
      }
    });
    
    // Theme toggle
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const newTheme = this.themeManager.cycleTheme();
        this.setupTheme();
        
        // Update theme selector if available
        if (themeSelector) {
          themeSelector.value = newTheme;
        }
      });
    }
    
    // Clear chat button
    if (clearButton) {
      clearButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear the current chat and memory?')) {
          this.messages = [];
          this.renderMessages();
          this.chatHistoryManager.clearCurrentChat();
          
          // Clear memory if available
          if (this.memoryManager) {
            try {
              await this.memoryManager.clearMemory();
              console.log('Memory cleared');
            } catch (error) {
              console.error('Error clearing memory:', error);
            }
          }
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
          this.updateMemoryPanel();
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
    
    // Setup chat sidebar events
    this.renderChatSidebar();
  }

  render() {
    // Create a style element for the component
    const style = document.createElement('style');
    style.textContent = getStyles();
    
    // Set the HTML content
    this.shadowRoot.innerHTML = getTemplate.call(this);
    
    // Add the styles
    this.shadowRoot.prepend(style);
    
    // Render initial messages
    this.renderMessages();
  }
}

// Register the web component
customElements.define('chat-component', ChatComponent);
