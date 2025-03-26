/**
 * Chat service for managing messages and interactions with the LLM
 */
import { loadChatHistory, saveChatHistory } from '../utils/storage.js';
import { formatTime } from '../utils/time-formatter.js';
import { markdownToHtml, highlightCodeBlocks } from '../utils/markdown-formatter.js';

export class ChatService {
  constructor(component) {
    this.component = component;
    this.messages = [];
    this.isProcessing = false;
    this.modelLoaded = false;
    this.selectedModel = "Qwen2.5-0.5B-Instruct-q0f16-MLC";
    this.availableModels = [
      { id: "Qwen2.5-0.5B-Instruct-q0f16-MLC", name: "Qwen 0.5B (Fast)" },
      { id: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC", name: "DeepSeek 7B (Smart)" }
    ];
    this.chatHistory = loadChatHistory();
    this.activeChat = this.chatHistory.length > 0 ? this.chatHistory[0].id : null;
    this.worker = null;
    this.typingTimeout = null;
  }

  /**
   * Initialize the web worker for handling LLM interactions
   */
  initWorker() {
    this.worker = new Worker('./chat-worker.js', { type: 'module' });
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    
    // Initialize the model
    this.worker.postMessage({ 
      type: 'init', 
      model: this.selectedModel 
    });
    
    this.updateStatus('Initializing model...');
  }

  /**
   * Handle messages from the worker
   * @param {MessageEvent} event - Message event from the worker
   */
  handleWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch(type) {
      case 'init-progress':
        this.updateProgress(data);
        break;
      case 'init-complete':
        this.modelLoaded = true;
        this.updateStatus('Model loaded');
        this.enableInput();
        this.component.shadowRoot.querySelector('.loading-container').classList.add('hidden');
        break;
      case 'response-chunk':
        this.updateResponse(data.text);
        break;
      case 'response-complete':
        this.completeResponse(data.message);
        break;
      case 'error':
        this.handleError(data.error);
        break;
    }
  }

  /**
   * Update the progress bar during model loading
   * @param {Object} progress - Progress data from the worker
   */
  updateProgress(progress) {
    const { text, progress: value } = progress;
    const progressBar = this.component.shadowRoot.querySelector('.progress-bar');
    const progressText = this.component.shadowRoot.querySelector('.progress-text');
    
    if (progressBar && progressText) {
      progressBar.value = value * 100;
      progressText.textContent = text;
    }
  }

  /**
   * Update the status message
   * @param {string} status - Status message to display
   */
  updateStatus(status) {
    const statusEl = this.component.shadowRoot.querySelector('.status');
    if (statusEl) {
      statusEl.textContent = status;
    }
  }

  /**
   * Update the response with new text chunks
   * @param {string} text - Text chunk to display
   */
  updateResponse(text) {
    const responseEl = this.component.shadowRoot.querySelector('.message.assistant.latest .message-content');
    if (responseEl) {
      // Convert markdown to HTML
      const formatted = markdownToHtml(text);
      responseEl.innerHTML = formatted;
      
      // Apply syntax highlighting to code blocks
      highlightCodeBlocks(responseEl);
    }
  }

  /**
   * Complete the response when the LLM is finished generating
   * @param {Object} message - Completed message object
   */
  async completeResponse(message) {
    // Update the complete response
    const assistantMessage = {
      role: 'assistant',
      content: message.content,
      timestamp: this.messages[this.messages.length - 1].timestamp
    };
    
    this.messages[this.messages.length - 1] = assistantMessage;
    
    // Remove the 'latest' class and enable input
    const latestMessage = this.component.shadowRoot.querySelector('.message.assistant.latest');
    if (latestMessage) {
      latestMessage.classList.remove('latest');
    }
    
    // Add to memory if available
    if (this.component.memoryInitialized && this.component.memoryManager) {
      try {
        await this.component.memoryManager.addMessage(assistantMessage);
      } catch (error) {
        console.error('Error adding assistant message to memory:', error);
      }
    }
    
    this.isProcessing = false;
    this.enableInput();
    
    // Save the updated chat history
    this.saveChatHistory();
  }

  /**
   * Handle errors from the worker
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error('Error:', error);
    this.updateStatus(`Error: ${error.message || 'Unknown error'}`);
    this.isProcessing = false;
    this.enableInput();
  }

  /**
   * Send a user message to the LLM
   * @param {string} content - Message content
   */
  async sendMessage(content) {
    // Add user message with timestamp
    const userMessage = { 
      role: 'user', 
      content,
      timestamp: new Date().toISOString()
    };
    this.messages.push(userMessage);
    this.renderMessages();
    
    // Display typing indicator
    this.showTypingIndicator();
    
    // Disable input during processing
    this.isProcessing = true;
    this.disableInput();
    
    // Add message to memory if available
    if (this.component.memoryInitialized && this.component.memoryManager) {
      await this.component.memoryManager.addMessage(userMessage);
    }
    
    // Build context with memory and knowledge if available
    let context = {};
    let enhancedPrompt = content;
    
    try {
      if (this.component.memoryInitialized && this.component.memoryManager) {
        // Get context from memory
        context = await this.component.memoryManager.buildContext(content);
        
        // Search knowledge base if available
        let knowledgeResults = [];
        if (this.component.knowledgeInitialized && this.component.knowledgeLoader) {
          knowledgeResults = await this.component.knowledgeLoader.query(content, 3);
        }
        
        // Format context as messages for the LLM
        const messageContext = this.component.memoryManager.formatContextMessages(context, content);
        
        // Add knowledge to the context if available
        if (knowledgeResults && knowledgeResults.length > 0) {
          // Add knowledge to the system message
          let knowledgeContext = "I've found some relevant information that might help answer the question:\\n\\n";
          
          knowledgeResults.forEach((result, index) => {
            knowledgeContext += `[${index + 1}] From ${result.document?.title || 'documentation'}:\\n${result.text}\\n\\n`;
          });
          
          // Add or update system message with knowledge
          if (messageContext.length > 0 && messageContext[0].role === 'system') {
            messageContext[0].content += '\\n\\n' + knowledgeContext;
          } else {
            messageContext.unshift({
              role: 'system',
              content: knowledgeContext
            });
          }
        }
        
        console.log('Using enhanced context:', messageContext);
        
        // Add placeholder for assistant response with timestamp
        this.messages.push({ 
          role: 'assistant', 
          content: '',
          timestamp: new Date().toISOString()
        });
        this.renderMessages();
        
        // Send enhanced context to worker
        this.worker.postMessage({
          type: 'generate',
          messages: messageContext,
          model: this.selectedModel
        });
      } else {
        // Fallback to regular approach if memory not initialized
        // Add placeholder for assistant response with timestamp
        this.messages.push({ 
          role: 'assistant', 
          content: '',
          timestamp: new Date().toISOString()
        });
        this.renderMessages();
        
        // Send to worker
        this.worker.postMessage({
          type: 'generate',
          messages: this.messages.slice(0, -1), // Don't include the empty assistant message
          model: this.selectedModel
        });
      }
    } catch (error) {
      console.error('Error building context for message:', error);
      
      // Fallback to regular approach
      // Add placeholder for assistant response with timestamp
      this.messages.push({ 
        role: 'assistant', 
        content: '',
        timestamp: new Date().toISOString()
      });
      this.renderMessages();
      
      // Send to worker
      this.worker.postMessage({
        type: 'generate',
        messages: this.messages.slice(0, -1), // Don't include the empty assistant message
        model: this.selectedModel
      });
    }
    
    // Save chat history
    this.saveChatHistory();
  }

  /**
   * Show the typing indicator
   */
  showTypingIndicator() {
    const statusEl = this.component.shadowRoot.querySelector('.status');
    if (statusEl) {
      statusEl.innerHTML = 'Thinking <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    }
  }

  /**
   * Save the current chat history to local storage
   */
  saveChatHistory() {
    try {
      // Find the current chat history object
      let currentChat = this.chatHistory.find(chat => chat.id === this.activeChat);
      
      if (!currentChat) {
        // Create a new chat if none exists
        currentChat = {
          id: `chat_${Date.now()}`,
          name: `Chat ${this.chatHistory.length + 1}`,
          messages: []
        };
        this.chatHistory.unshift(currentChat);
        this.activeChat = currentChat.id;
      }
      
      // Update the messages
      currentChat.messages = [...this.messages];
      
      // Save to localStorage
      saveChatHistory(this.chatHistory);
      
      // Update the sidebar
      this.renderChatSidebar();
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }

  /**
   * Create a new chat
   */
  createNewChat() {
    // Save current chat first
    this.saveChatHistory();
    
    // Create new chat
    const newChat = {
      id: `chat_${Date.now()}`,
      name: `Chat ${this.chatHistory.length + 1}`,
      messages: []
    };
    
    // Add to history and set as active
    this.chatHistory.unshift(newChat);
    this.activeChat = newChat.id;
    
    // Clear messages and render UI
    this.messages = [];
    this.renderMessages();
    this.renderChatSidebar();
    
    // Save updated history
    saveChatHistory(this.chatHistory);
    
    // Focus input
    this.component.shadowRoot.querySelector('input').focus();
  }

  /**
   * Load a specific chat from history
   * @param {string} chatId - ID of the chat to load
   */
  loadChat(chatId) {
    // Find the chat in history
    const chat = this.chatHistory.find(c => c.id === chatId);
    if (chat) {
      this.activeChat = chatId;
      this.messages = [...chat.messages];
      this.renderMessages();
      this.renderChatSidebar();
    }
  }

  /**
   * Delete a chat from history
   * @param {string} chatId - ID of the chat to delete
   */
  deleteChat(chatId) {
    // Find the chat index
    const index = this.chatHistory.findIndex(c => c.id === chatId);
    if (index !== -1) {
      // Remove the chat
      this.chatHistory.splice(index, 1);
      
      // If it was the active chat, switch to another one
      if (this.activeChat === chatId) {
        if (this.chatHistory.length > 0) {
          this.activeChat = this.chatHistory[0].id;
          this.messages = [...this.chatHistory[0].messages];
        } else {
          // Create a new chat if none left
          const newChat = {
            id: `chat_${Date.now()}`,
            name: 'New Chat',
            messages: []
          };
          this.chatHistory.push(newChat);
          this.activeChat = newChat.id;
          this.messages = [];
        }
      }
      
      // Update UI
      this.renderMessages();
      this.renderChatSidebar();
      
      // Save updated history
      saveChatHistory(this.chatHistory);
    }
  }

  /**
   * Render the chat sidebar with history
   */
  renderChatSidebar() {
    const sidebar = this.component.shadowRoot.querySelector('.chat-sidebar-content');
    if (!sidebar) return;
    
    sidebar.innerHTML = '';
    
    // Add "New Chat" button
    const newChatBtn = document.createElement('button');
    newChatBtn.classList.add('new-chat-btn');
    newChatBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
      New Chat
    `;
    newChatBtn.addEventListener('click', () => this.createNewChat());
    sidebar.appendChild(newChatBtn);
    
    // Add divider
    const divider = document.createElement('div');
    divider.classList.add('sidebar-divider');
    sidebar.appendChild(divider);
    
    // Add chat history
    const historyList = document.createElement('div');
    historyList.classList.add('chat-history-list');
    
    this.chatHistory.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.classList.add('chat-history-item');
      if (chat.id === this.activeChat) {
        chatItem.classList.add('active');
      }
      
      // Get preview text from the first user message
      const previewMessage = chat.messages.find(m => m.role === 'user')?.content || 'New conversation';
      const preview = previewMessage.length > 25 ? previewMessage.substring(0, 25) + '...' : previewMessage;
      
      chatItem.innerHTML = `
        <div class="chat-item-content">
          <svg viewBox="0 0 24 24" class="chat-icon"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>
          <div class="chat-item-text">
            <div class="chat-item-title">${chat.name}</div>
            <div class="chat-item-preview">${preview}</div>
          </div>
        </div>
        <button class="chat-delete-btn" data-chat-id="${chat.id}" title="Delete chat">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </button>
      `;
      
      // Add click listener to load chat
      chatItem.addEventListener('click', (e) => {
        // Don't trigger if clicking the delete button
        if (e.target.closest('.chat-delete-btn')) return;
        this.loadChat(chat.id);
      });
      
      historyList.appendChild(chatItem);
    });
    
    sidebar.appendChild(historyList);
    
    // Setup delete buttons
    const deleteButtons = this.component.shadowRoot.querySelectorAll('.chat-delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chatId = btn.dataset.chatId;
        if (confirm('Are you sure you want to delete this chat?')) {
          this.deleteChat(chatId);
        }
      });
    });
  }

  /**
   * Disable the input elements
   */
  disableInput() {
    const input = this.component.shadowRoot.querySelector('.message-input');
    const sendButton = this.component.shadowRoot.querySelector('.send-button');
    const micButton = this.component.shadowRoot.querySelector('.mic-btn');
    const emojiButton = this.component.shadowRoot.querySelector('.emoji-btn');
    
    input.disabled = true;
    if (sendButton) sendButton.disabled = true;
    if (micButton) micButton.disabled = true;
    if (emojiButton) emojiButton.disabled = true;
  }

  /**
   * Enable the input elements
   */
  enableInput() {
    const input = this.component.shadowRoot.querySelector('.message-input');
    const sendButton = this.component.shadowRoot.querySelector('.send-button');
    const micButton = this.component.shadowRoot.querySelector('.mic-btn');
    const emojiButton = this.component.shadowRoot.querySelector('.emoji-btn');
    
    input.disabled = false;
    if (sendButton) sendButton.disabled = false;
    if (micButton) micButton.disabled = false;
    if (emojiButton) emojiButton.disabled = false;
    input.focus();
  }

  /**
   * Render all messages in the chat
   */
  renderMessages() {
    const messagesContainer = this.component.shadowRoot.querySelector('.messages');
    messagesContainer.innerHTML = '';
    
    this.messages.forEach((message, index) => {
      const messageEl = document.createElement('div');
      messageEl.classList.add('message', message.role);
      
      // If it's the latest assistant message, add a class for streaming updates
      if (message.role === 'assistant' && index === this.messages.length - 1) {
        messageEl.classList.add('latest');
      }
      
      // Add timestamp if available
      const timestamp = message.timestamp || new Date().toISOString();
      messageEl.dataset.timestamp = timestamp;
      
      const avatarEl = document.createElement('div');
      avatarEl.classList.add('avatar');
      
      // Enhanced avatars with animation
      if (message.role === 'user') {
        avatarEl.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>';
      } else {
        avatarEl.innerHTML = `
          <div class="ai-avatar">
            <svg viewBox="0 0 36 36" class="ai-icon">
              <path fill="currentColor" d="M18,2 C9.163,2 2,9.163 2,18 C2,26.837 9.163,34 18,34 C26.837,34 34,26.837 34,18 C34,9.163 26.837,2 18,2 Z M18,6 C16.895,6 16,6.895 16,8 C16,9.105 16.895,10 18,10 C19.105,10 20,9.105 20,8 C20,6.895 19.105,6 18,6 Z M18,29 C14.134,29 11,25.866 11,22 C11,18.134 14.134,15 18,15 C21.866,15 25,18.134 25,22 C25,25.866 21.866,29 18,29 Z"></path>
            </svg>
            <div class="ai-circles">
              <div class="ai-circle"></div>
              <div class="ai-circle"></div>
              <div class="ai-circle"></div>
            </div>
          </div>
        `;
      }
      
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('message-wrapper');
      
      // Add timestamp display
      const timeEl = document.createElement('div');
      timeEl.classList.add('message-time');
      timeEl.textContent = formatTime(timestamp);
      
      const contentEl = document.createElement('div');
      contentEl.classList.add('message-content');
      
      // Convert markdown to HTML
      if (message.role === 'assistant') {
        contentEl.innerHTML = markdownToHtml(message.content);
        highlightCodeBlocks(contentEl);
      } else {
        contentEl.textContent = message.content;
      }
      
      // Add reaction buttons for assistant messages
      if (message.role === 'assistant' && !messageEl.classList.contains('latest')) {
        const actionsEl = document.createElement('div');
        actionsEl.classList.add('message-actions');
        actionsEl.innerHTML = `
          <button class="action-btn copy-btn" title="Copy to clipboard">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
          </button>
          <button class="action-btn feedback-btn positive" title="Good response">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path></svg>
          </button>
          <button class="action-btn feedback-btn negative" title="Bad response">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg>
          </button>
        `;
        contentWrapper.appendChild(actionsEl);
      }
      
      contentWrapper.appendChild(contentEl);
      contentWrapper.appendChild(timeEl);
      
      messageEl.appendChild(avatarEl);
      messageEl.appendChild(contentWrapper);
      
      messagesContainer.appendChild(messageEl);
    });
    
    // Scroll to bottom with smooth animation
    this.scrollToBottom();
    
    // Setup copy buttons
    this.setupCopyButtons();
    this.setupFeedbackButtons();
  }

  /**
   * Scroll the message container to the bottom
   */
  scrollToBottom() {
    const messagesContainer = this.component.shadowRoot.querySelector('.messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Setup copy buttons for messages
   */
  setupCopyButtons() {
    const copyButtons = this.component.shadowRoot.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const messageEl = btn.closest('.message');
        const contentEl = messageEl.querySelector('.message-content');
        
        // Get text content, not HTML
        const textToCopy = contentEl.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Show copied tooltip
          btn.classList.add('copied');
          btn.setAttribute('title', 'Copied!');
          
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.setAttribute('title', 'Copy to clipboard');
          }, 2000);
        });
      });
    });
  }

  /**
   * Setup feedback buttons for messages
   */
  setupFeedbackButtons() {
    const feedbackButtons = this.component.shadowRoot.querySelectorAll('.feedback-btn');
    feedbackButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isPositive = btn.classList.contains('positive');
        const messageEl = btn.closest('.message');
        
        // Visual feedback
        messageEl.classList.add(isPositive ? 'feedback-positive' : 'feedback-negative');
        
        // Disable all feedback buttons for this message
        const allBtns = messageEl.querySelectorAll('.feedback-btn');
        allBtns.forEach(b => b.disabled = true);
        
        // Here you could send feedback to your analytics or backend
        console.log(`User gave ${isPositive ? 'positive' : 'negative'} feedback for message:`, 
          messageEl.querySelector('.message-content').textContent);
      });
    });
  }

  /**
   * Change the selected model
   * @param {string} modelId - ID of the model to use
   */
  changeModel(modelId) {
    if (modelId !== this.selectedModel) {
      this.selectedModel = modelId;
      this.component.shadowRoot.querySelector('.loading-container').classList.remove('hidden');
      this.modelLoaded = false;
      
      // Reinitialize the worker with the new model
      this.worker.terminate();
      this.initWorker();
    }
  }
}