/**
 * HTML template for the ChatComponent
 * This file contains the HTML template that will be used to render the chat component
 */

export function getTemplate() {
  return `
    <div class="chat-container">
      <!-- Sidebar -->
      <div class="chat-sidebar">
        <div class="chat-sidebar-header">
          <h3 class="chat-sidebar-title">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3M17,12V10H15V12H17M13,12V10H11V12H13M9,12V10H7V12H9Z"></path></svg>
            Chats
          </h3>
        </div>
        <div class="chat-sidebar-content">
          <!-- Chat history will be populated here -->
        </div>
      </div>
      
      <!-- Main chat area -->
      <div class="chat-main">
        <div class="header">
          <div class="header-content">
            <div>
              <h2>${this.brand.toUpperCase() === 'ATT' ? 'AT&T' : this.brand.charAt(0).toUpperCase() + this.brand.slice(1)} Assistant</h2>
              <div class="status">Initializing...</div>
            </div>
          </div>
          <div class="header-actions">
            <button class="memory-toggle" aria-label="View memory">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path></svg>
              Memory
            </button>
            <button class="theme-toggle" aria-label="Change theme">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M13,7H11V14H13V7M13,15H11V17H13V15Z"></path></svg>
            </button>
            <button class="clear-chat" aria-label="Clear chat">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path></svg>
              Clear
            </button>
          </div>
        </div>
        
        <div class="messages"></div>
        
        <!-- Memory Panel -->
        <div class="memory-panel" id="memoryPanel">
          <div class="memory-header">
            <span>Memory & Knowledge</span>
            <button class="memory-toggle close-memory" id="closeMemory">×</button>
          </div>
          <div class="memory-content" id="memoryContent">
            <!-- Memory context will be displayed here -->
            <p>No context has been sent to the AI yet. Send a message to see what context is used.</p>
          </div>
          <div class="memory-stats" id="memoryStats">
            <div>Recent messages: <span id="recentCount">0</span></div>
            <div>Total memories: <span id="totalCount">0</span></div>
          </div>
        </div>
        
        <div class="input-container">
          <form>
            <div class="message-input-container">
              <input type="text" class="message-input" placeholder="Type your message..." autocomplete="off" disabled>
              <div class="input-actions">
                <button type="button" class="input-action-btn emoji-btn" title="Add emoji" disabled>
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,17.5C14.33,17.5 16.3,16.04 17.11,14H6.89C7.69,16.04 9.67,17.5 12,17.5M8.5,11A1.5,1.5 0 0,0 10,9.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 7,9.5A1.5,1.5 0 0,0 8.5,11M15.5,11A1.5,1.5 0 0,0 17,9.5A1.5,1.5 0 0,0 15.5,8A1.5,1.5 0 0,0 14,9.5A1.5,1.5 0 0,0 15.5,11M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="send-button" disabled>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
      
      <!-- Loading screen -->
      <div class="loading-container">
        <div class="loading-content">
          <div class="loading-logo">
            <svg viewBox="0 0 36 36" class="loading-icon">
              <path fill="var(--primary-color)" d="M18,2 C9.163,2 2,9.163 2,18 C2,26.837 9.163,34 18,34 C26.837,34 34,26.837 34,18 C34,9.163 26.837,2 18,2 Z M18,7 C20.761,7 23,9.239 23,12 C23,14.761 20.761,17 18,17 C15.239,17 13,14.761 13,12 C13,9.239 15.239,7 18,7 Z M18,29 C14.134,29 10.65,27.111 8.567,24.111 C8.731,21.026 14.273,19.334 18,19.334 C21.727,19.334 27.269,21.026 27.433,24.111 C25.35,27.111 21.866,29 18,29 Z"></path>
            </svg>
            <div class="loading-circles">
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
            </div>
          </div>
          <h3>Loading AI Model</h3>
          <p>Please wait while we load the language model.</p>
          <div class="progress-container">
            <progress class="progress-bar" value="0" max="100"></progress>
            <div class="progress-text">Initializing...</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
