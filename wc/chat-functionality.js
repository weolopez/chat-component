/**
 * Chat functionality methods for the ChatComponent
 * This file contains methods related to chat processing and message handling
 * that will be imported into the main ChatComponent class
 */

/**
 * Handle completion of a response
 * @param {Object} message - The completed message
 */
export async function completeResponse(message) {
  // Update the complete response
  const assistantMessage = {
    role: 'assistant',
    content: message.content,
    timestamp: this.messages[this.messages.length - 1].timestamp
  };
  
  this.messages[this.messages.length - 1] = assistantMessage;
  
  // Remove the 'latest' class
  const latestMessage = this.shadowRoot.querySelector('.message.assistant.latest');
  if (latestMessage) {
    latestMessage.classList.remove('latest');
  }
  
  // Add to memory if available
  if (this.memoryManager) {
    try {
      await this.memoryManager.addMessage(assistantMessage);
    } catch (error) {
      console.error('Error adding assistant message to memory:', error);
    }
  }
  
  this.isProcessing = false;
  this.enableInput();
  
  // Save the updated chat history
  this.chatHistoryManager.updateLastMessage(assistantMessage);
}

/**
 * Handle error during chat processing
 * @param {Error} error - The error that occurred
 */
export function handleError(error) {
  console.error('Error:', error);
  this.updateStatus(`Error: ${error.message || 'Unknown error'}`);
  this.isProcessing = false;
  this.enableInput();
}

/**
 * Send a message to the chat
 * @param {string} content - The message content
 */
export async function sendMessage(content) {
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
  
  // Add message to memory and chat history
  this.chatHistoryManager.addMessage(userMessage);
  if (this.memoryManager) {
    await this.memoryManager.addMessage(userMessage);
  }
  
  try {
    // Build context with memory and knowledge if available
    let messageContext = [];
    
    if (this.memoryManager) {
      // Get enhanced context from memory manager
      messageContext = await this.memoryManager.buildContext(content);
    }
    
    // Add placeholder for assistant response with timestamp
    this.messages.push({ 
      role: 'assistant', 
      content: '',
      timestamp: new Date().toISOString()
    });
    this.renderMessages();
    
    // Use context if available, otherwise use regular messages
    if (messageContext && messageContext.length > 0) {
      this.chatEngine.generateResponse(messageContext);
    } else {
      this.chatEngine.generateResponse(this.messages.slice(0, -1)); // Don't include the empty assistant message
    }
  } catch (error) {
    console.error('Error sending message:', error);
    this.handleError(error);
  }
}
