/**
 * Storage utilities for the chat component
 */

/**
 * Loads chat history from local storage
 * @returns {Array} The chat history or a default array
 */
export function loadChatHistory() {
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
 * Saves chat history to local storage
 * @param {Array} chatHistory - Chat history to save
 */
export function saveChatHistory(chatHistory) {
  try {
    localStorage.setItem('chat-history', JSON.stringify(chatHistory));
  } catch (e) {
    console.error('Failed to save chat history:', e);
  }
}

/**
 * Get active theme from local storage
 * @param {string} defaultTheme - Default theme to use if none is stored
 * @returns {string} The active theme 
 */
export function getActiveTheme(defaultTheme = 'att') {
  return localStorage.getItem('chat-theme') || defaultTheme;
}

/**
 * Save active theme to local storage
 * @param {string} theme - Theme to save
 */
export function saveActiveTheme(theme) {
  localStorage.setItem('chat-theme', theme);
}