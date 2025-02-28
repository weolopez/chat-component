class ChatComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.messages = [];
    this.isProcessing = false;
    this.engine = null;
    this.modelLoaded = false;
    this.selectedModel = "Qwen2.5-0.5B-Instruct-q0f16-MLC"
  }
//"DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initWorker();
  }

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
        this.shadowRoot.querySelector('.loading-container').classList.add('hidden');
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

  updateProgress(progress) {
    const { text, progress: value } = progress;
    const progressBar = this.shadowRoot.querySelector('.progress-bar');
    const progressText = this.shadowRoot.querySelector('.progress-text');
    
    if (progressBar && progressText) {
      progressBar.value = value * 100;
      progressText.textContent = text;
    }
  }

  updateStatus(status) {
    const statusEl = this.shadowRoot.querySelector('.status');
    if (statusEl) {
      statusEl.textContent = status;
    }
  }

  updateResponse(text) {
    const responseEl = this.shadowRoot.querySelector('.message.assistant.latest .message-content');
    if (responseEl) {
      responseEl.textContent = text;
    }
  }

  completeResponse(message) {
    // Update the complete response
    this.messages[this.messages.length - 1].content = message.content;
    
    // Remove the 'latest' class and enable input
    const latestMessage = this.shadowRoot.querySelector('.message.assistant.latest');
    if (latestMessage) {
      latestMessage.classList.remove('latest');
    }
    
    this.isProcessing = false;
    this.enableInput();
  }

  handleError(error) {
    console.error('Error:', error);
    this.updateStatus(`Error: ${error.message || 'Unknown error'}`);
    this.isProcessing = false;
    this.enableInput();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const input = this.shadowRoot.querySelector('input');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = input.value.trim();
      
      if (message && !this.isProcessing && this.modelLoaded) {
        this.sendMessage(message);
        input.value = '';
      }
    });

    // Add enter key support
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        form.dispatchEvent(new Event('submit'));
      }
    });
  }

  sendMessage(content) {
    // Add user message
    this.messages.push({ role: 'user', content });
    this.renderMessages();
    
    // Disable input during processing
    this.isProcessing = true;
    this.disableInput();
    
    // Add placeholder for assistant response
    this.messages.push({ role: 'assistant', content: '' });
    this.renderMessages();
    
    // Send to worker
    this.worker.postMessage({
      type: 'generate',
      messages: this.messages.slice(0, -1) // Don't include the empty assistant message
    });
  }

  disableInput() {
    const input = this.shadowRoot.querySelector('input');
    const button = this.shadowRoot.querySelector('button');
    
    input.disabled = true;
    button.disabled = true;
  }

  enableInput() {
    const input = this.shadowRoot.querySelector('input');
    const button = this.shadowRoot.querySelector('button');
    
    input.disabled = false;
    button.disabled = false;
    input.focus();
  }

  renderMessages() {
    const messagesContainer = this.shadowRoot.querySelector('.messages');
    messagesContainer.innerHTML = '';
    
    this.messages.forEach((message, index) => {
      const messageEl = document.createElement('div');
      messageEl.classList.add('message', message.role);
      
      // If it's the latest assistant message, add a class for streaming updates
      if (message.role === 'assistant' && index === this.messages.length - 1) {
        messageEl.classList.add('latest');
      }
      
      const avatarEl = document.createElement('div');
      avatarEl.classList.add('avatar');
      avatarEl.innerHTML = message.role === 'user' ? 
        '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>' :
        '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-8h10v2H7z"></path></svg>';
      
      const contentEl = document.createElement('div');
      contentEl.classList.add('message-content');
      contentEl.textContent = message.content;
      
      messageEl.appendChild(avatarEl);
      messageEl.appendChild(contentEl);
      messagesContainer.appendChild(messageEl);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          --primary-color: #7c4dff;
          --secondary-color: #f5f5f7;
          --text-color: #333;
          --background-color: #fff;
          --input-background: #f0f0f0;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --message-user-bg: #e1f5fe;
          --message-assistant-bg: #f5f5f7;
          --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-family: var(--font-family);
        }

        :host([dark]) {
          --primary-color: #bb86fc;
          --secondary-color: #2d2d30;
          --text-color: #e0e0e0;
          --background-color: #1e1e1e;
          --input-background: #2d2d30;
          --shadow-color: rgba(0, 0, 0, 0.3);
          --message-user-bg: #3700b3;
          --message-assistant-bg: #2d2d30;
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: var(--background-color);
          color: var(--text-color);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 30px var(--shadow-color);
        }

        .header {
          padding: 16px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px var(--shadow-color);
          z-index: 1;
        }

        .header h2 {
          margin: 0;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .status {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .messages {
          flex-grow: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 90%;
          animation: fade-in 0.3s ease-in-out;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-color);
          color: white;
          flex-shrink: 0;
        }

        .message.user .avatar {
          background-color: var(--primary-color);
        }

        .message.assistant .avatar {
          background-color: #4a4a4a;
        }

        .avatar svg {
          width: 20px;
          height: 20px;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 18px;
          box-shadow: 0 2px 8px var(--shadow-color);
          line-height: 1.5;
        }

        .message.user .message-content {
          background-color: var(--message-user-bg);
          border-top-right-radius: 4px;
          color: white;
        }

        .message.assistant .message-content {
          background-color: var(--message-assistant-bg);
          border-top-left-radius: 4px;
        }

        .message.assistant.latest .message-content::after {
          content: '';
          display: inline-block;
          width: 8px;
          height: 16px;
          background-color: var(--primary-color);
          margin-left: 4px;
          border-radius: 1px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }

        .input-container {
          padding: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background-color: var(--background-color);
          z-index: 1;
        }

        form {
          display: flex;
          gap: 8px;
        }

        input {
          flex-grow: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 24px;
          background-color: var(--input-background);
          color: var(--text-color);
          outline: none;
          font-family: inherit;
          transition: box-shadow 0.3s ease;
        }

        input:focus {
          box-shadow: 0 0 0 2px var(--primary-color);
        }

        button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease;
          outline: none;
        }

        button:hover {
          background-color: #6c3eff;
          transform: translateY(-2px);
        }

        button:active {
          transform: translateY(0);
        }

        button svg {
          width: 20px;
          height: 20px;
        }

        button:disabled, input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--background-color);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10;
          padding: 20px;
          text-align: center;
        }

        .loading-container.hidden {
          display: none;
        }

        .progress-container {
          width: 80%;
          max-width: 400px;
          margin-top: 20px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background-color: var(--input-background);
          overflow: hidden;
          position: relative;
        }

        .progress-bar::-webkit-progress-bar {
          background-color: var(--input-background);
          border-radius: 4px;
        }

        .progress-bar::-webkit-progress-value {
          background-color: var(--primary-color);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          margin-top: 8px;
          font-size: 0.9rem;
          color: var(--text-color);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --primary-color: #bb86fc;
            --secondary-color: #2d2d30;
            --text-color: #e0e0e0;
            --background-color: #1e1e1e;
            --input-background: #2d2d30;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --message-user-bg: #3700b3;
            --message-assistant-bg: #2d2d30;
          }
        }

        @media (max-width: 768px) {
          .chat-container {
            border-radius: 0;
            height: 100vh;
          }
          
          .message {
            max-width: 95%;
          }
        }
      </style>
      <div class="chat-container">
        <div class="header">
          <h2>AI Chat</h2>
          <div class="status">Initializing...</div>
        </div>
        <div class="messages"></div>
        <div class="input-container">
          <form>
            <input type="text" placeholder="Type your message..." autocomplete="off" disabled>
            <button type="submit" disabled>
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
        </div>
        <div class="loading-container">
          <h3>Loading AI Model</h3>
          <p>Please wait while we load the language model. This may take a moment.</p>
          <div class="progress-container">
            <progress class="progress-bar" value="0" max="100"></progress>
            <div class="progress-text">Initializing...</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('chat-component', ChatComponent);
