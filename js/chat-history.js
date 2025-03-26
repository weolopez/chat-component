/**
 * ChatHistory - Manages chat history storage, retrieval, and manipulation
 */
export class ChatHistory {
  constructor() {
    this.chatHistory = this.loadChatHistory();
    this.activeChat = this.chatHistory.length > 0 ? this.chatHistory[0].id : null;
    this.messages = [];
    
    // Load active chat messages if available
    if (this.activeChat) {
      const activeChat = this.chatHistory.find(chat => chat.id === this.activeChat);
      if (activeChat) {
        this.messages = [...activeChat.messages];
      }
    }
  }

  /**
   * Load chat history from localStorage
   * @returns {Array} The loaded chat history
   */
  loadChatHistory() {
    try {
      const savedHistory = localStorage.getItem('chat-history');
      return savedHistory ? JSON.parse(savedHistory) : [
        { id: 'default', name: 'New Chat', messages: [] }
      ];
    } catch (e) {
      console.error('Failed to load chat history:', e);
      return [{ id: 'default', name: 'New Chat', messages: [] }];
    }
  }
  
  /**
   * Save current chat history to localStorage
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
      localStorage.setItem('chat-history', JSON.stringify(this.chatHistory));
      
      return true;
    } catch (e) {
      console.error('Failed to save chat history:', e);
      return false;
    }
  }
  
  /**
   * Create a new chat
   * @returns {string} The ID of the new chat
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
    
    // Clear messages
    this.messages = [];
    
    // Save updated history
    localStorage.setItem('chat-history', JSON.stringify(this.chatHistory));
    
    return this.activeChat;
  }
  
  /**
   * Load a specific chat by ID
   * @param {string} chatId - The ID of the chat to load
   * @returns {boolean} Whether the chat was successfully loaded
   */
  loadChat(chatId) {
    // Find the chat in history
    const chat = this.chatHistory.find(c => c.id === chatId);
    if (chat) {
      this.activeChat = chatId;
      this.messages = [...chat.messages];
      return true;
    }
    return false;
  }
  
  /**
   * Delete a chat by ID
   * @param {string} chatId - The ID of the chat to delete
   * @returns {boolean} Whether the chat was successfully deleted
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
      
      // Save updated history
      localStorage.setItem('chat-history', JSON.stringify(this.chatHistory));
      
      return true;
    }
    return false;
  }
  
  /**
   * Add a message to the current chat
   * @param {Object} message - The message to add
   */
  addMessage(message) {
    this.messages.push(message);
    this.saveChatHistory();
  }
  
  /**
   * Update the last message in the chat
   * @param {Object} message - The updated message
   */
  updateLastMessage(message) {
    if (this.messages.length > 0) {
      this.messages[this.messages.length - 1] = message;
      this.saveChatHistory();
    }
  }
  
  /**
   * Get all messages for the current chat
   * @returns {Array} The messages for the current chat
   */
  getMessages() {
    return this.messages;
  }
  
  /**
   * Get all chats
   * @returns {Array} All chats
   */
  getAllChats() {
    return this.chatHistory;
  }
  
  /**
   * Get the active chat ID
   * @returns {string} The active chat ID
   */
  getActiveChatId() {
    return this.activeChat;
  }
  
  /**
   * Clear all messages in the current chat
   */
  clearCurrentChat() {
    this.messages = [];
    this.saveChatHistory();
  }
}