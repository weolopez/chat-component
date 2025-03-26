/**
 * UI methods for the ChatComponent
 * This file contains methods related to UI rendering and interaction
 * that will be imported into the main ChatComponent class
 */

/**
 * Setup theme for the chat component
 */
export function setupTheme() {
  const container = this.shadowRoot.querySelector('.chat-container');
  this.themeManager.applyTheme(container);
  this.themeManager.applyHostStyles(this.shadowRoot);
}

/**
 * Update progress bar during model loading
 * @param {Object} progress - Progress data
 */
export function updateProgress(progress) {
  const { text, progress: value } = progress;
  const progressBar = this.shadowRoot.querySelector('.progress-bar');
  const progressText = this.shadowRoot.querySelector('.progress-text');
  
  if (progressBar && progressText) {
    progressBar.value = value * 100;
    progressText.textContent = text;
  }
}

/**
 * Handle model loaded event
 */
export function handleModelLoaded() {
  this.shadowRoot.querySelector('.loading-container').classList.add('hidden');
  this.enableInput();
}

/**
 * Update status message
 * @param {string} status - Status message
 */
export function updateStatus(status) {
  const statusEl = this.shadowRoot.querySelector('.status');
  if (statusEl) {
    statusEl.textContent = status;
  }
}

/**
 * Update response text as it streams in
 * @param {string} text - Response text
 */
export function updateResponse(text) {
  const responseEl = this.shadowRoot.querySelector('.message.assistant.latest .message-content');
  if (responseEl) {
    // Convert markdown to HTML
    const formatted = this.Utils.markdownToHtml(text);
    responseEl.innerHTML = formatted;
    
    // Apply syntax highlighting to code blocks
    this.Utils.highlightCodeBlocks(responseEl);
  }
}

/**
 * Show typing indicator
 */
export function showTypingIndicator() {
  const statusEl = this.shadowRoot.querySelector('.status');
  if (statusEl) {
    statusEl.innerHTML = 'Thinking <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  }
}

/**
 * Disable input during processing
 */
export function disableInput() {
  const input = this.shadowRoot.querySelector('.message-input');
  const sendButton = this.shadowRoot.querySelector('.send-button');
  const micButton = this.shadowRoot.querySelector('.mic-btn');
  const emojiButton = this.shadowRoot.querySelector('.emoji-btn');
  
  input.disabled = true;
  if (sendButton) sendButton.disabled = true;
  if (micButton) micButton.disabled = true;
  if (emojiButton) emojiButton.disabled = true;
}

/**
 * Enable input after processing
 */
export function enableInput() {
  const input = this.shadowRoot.querySelector('.message-input');
  const sendButton = this.shadowRoot.querySelector('.send-button');
  const micButton = this.shadowRoot.querySelector('.mic-btn');
  const emojiButton = this.shadowRoot.querySelector('.emoji-btn');
  
  input.disabled = false;
  if (sendButton) sendButton.disabled = false;
  if (micButton) micButton.disabled = false;
  if (emojiButton) emojiButton.disabled = false;
  input.focus();
}

/**
 * Scroll messages container to bottom
 */
export function scrollToBottom() {
  const messagesContainer = this.shadowRoot.querySelector('.messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Setup copy buttons for messages
 */
export function setupCopyButtons() {
  const copyButtons = this.shadowRoot.querySelectorAll('.copy-btn');
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
export function setupFeedbackButtons() {
  const feedbackButtons = this.shadowRoot.querySelectorAll('.feedback-btn');
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
 * Render messages in the chat
 */
export function renderMessages() {
  const messagesContainer = this.shadowRoot.querySelector('.messages');
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
    timeEl.textContent = this.Utils.formatTime(timestamp);
    
    const contentEl = document.createElement('div');
    contentEl.classList.add('message-content');
    
    // Convert markdown to HTML
    if (message.role === 'assistant') {
      contentEl.innerHTML = this.Utils.markdownToHtml(message.content);
      this.Utils.highlightCodeBlocks(contentEl);
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
 * Update memory panel with current memory state
 */
export async function updateMemoryPanel() {
  if (!this.memoryManager) {
    console.warn('Memory not initialized');
    return;
  }
  
  const memoryContent = this.shadowRoot.querySelector('.memory-content');
  const memoryStats = this.shadowRoot.querySelector('.memory-stats');
  
  if (!memoryContent || !memoryStats) {
    return;
  }
  
  try {
    // Get recent messages
    const recentMessages = this.memoryManager.getRecentMessages(5);
    
    // Get stats
    const stats = await this.memoryManager.getMemoryStats();
    
    // Update stats
    if (memoryStats) {
      const recentCountEl = memoryStats.querySelector('#recentCount');
      const totalCountEl = memoryStats.querySelector('#totalCount');
      
      if (recentCountEl) recentCountEl.textContent = stats.recent;
      if (totalCountEl) totalCountEl.textContent = stats.total;
    }
    
    // Clear memory content
    memoryContent.innerHTML = '';
    
    // No context case
    if (stats.recent === 0 && stats.total === 0) {
      memoryContent.innerHTML = '<p>No context has been sent to the AI yet. Send a message to see what context is used.</p>';
      return;
    }
    
    // Create section for recent conversation history
    if (stats.recent > 0) {
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
    if (this.memoryManager.knowledgeInitialized) {
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
 * Render chat sidebar with history
 */
export function renderChatSidebar() {
  const sidebar = this.shadowRoot.querySelector('.chat-sidebar-content');
  if (!sidebar) return;
  
  sidebar.innerHTML = '';
  
  // Add "New Chat" button
  const newChatBtn = document.createElement('button');
  newChatBtn.classList.add('new-chat-btn');
  newChatBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
    New Chat
  `;
  newChatBtn.addEventListener('click', () => {
    const newChatId = this.chatHistoryManager.createNewChat();
    this.messages = this.chatHistoryManager.getMessages();
    this.renderMessages();
    this.renderChatSidebar();
    this.shadowRoot.querySelector('input').focus();
  });
  sidebar.appendChild(newChatBtn);
  
  // Add divider
  const divider = document.createElement('div');
  divider.classList.add('sidebar-divider');
  sidebar.appendChild(divider);
  
  // Add chat history
  const historyList = document.createElement('div');
  historyList.classList.add('chat-history-list');
  
  const allChats = this.chatHistoryManager.getAllChats();
  const activeChatId = this.chatHistoryManager.getActiveChatId();
  
  allChats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-history-item');
    if (chat.id === activeChatId) {
      chatItem.classList.add('active');
    }
    
    // Get preview text from the first user message
    const previewMessage = chat.messages.find(m => m.role === 'user')?.content || 'New conversation';
    const preview = this.Utils.truncateString(previewMessage, 25);
    
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
      
      if (this.chatHistoryManager.loadChat(chat.id)) {
        this.messages = this.chatHistoryManager.getMessages();
        this.renderMessages();
        this.renderChatSidebar();
      }
    });
    
    historyList.appendChild(chatItem);
  });
  
  sidebar.appendChild(historyList);
  
  // Setup delete buttons
  const deleteButtons = this.shadowRoot.querySelectorAll('.chat-delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chatId = btn.dataset.chatId;
      if (confirm('Are you sure you want to delete this chat?')) {
        if (this.chatHistoryManager.deleteChat(chatId)) {
          this.messages = this.chatHistoryManager.getMessages();
          this.renderMessages();
          this.renderChatSidebar();
        }
      }
    });
  });
}