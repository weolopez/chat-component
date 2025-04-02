/**
 * Chat component styles
 */

export function getChatStyles() {
  return `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: var(--font-family);
    }
    
    /* Theme classes are dynamically set, just add necessary fallbacks */

    .chat-container {
      display: flex;
      height: 100%;
      background-color: var(--background-color);
      color: var(--text-color);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 8px 30px var(--shadow-color);
      position: relative;
      transition: all 0.3s ease;
    }
    
    .chat-sidebar {
      background-color: var(--sidebar-bg);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 10;
      width: 0px;
      visibility: hidden;
      transform: translateX(-100%);
    }
    
    .chat-sidebar-header {
      padding: 16px;
      background: var(--primary-color);
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .chat-sidebar-title {
      margin: 0;
      font-weight: 600;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .chat-sidebar-title svg {
      width: 24px;
      height: 24px;
    }
    
    .chat-sidebar-content {
      flex-grow: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .new-chat-btn {
      background-color: var(--accent-color);
      color: white;
      border: none;
      border-radius: 30px;
      padding: 10px 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .new-chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .new-chat-btn svg {
      width: 18px;
      height: 18px;
    }
    
    .sidebar-divider {
      height: 1px;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 12px 0;
    }
    
    .chat-history-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .chat-history-item {
      padding: 10px;
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    
    .chat-history-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .chat-history-item.active {
      background-color: rgba(0, 0, 0, 0.08);
      border-color: var(--primary-color);
    }
    
    .chat-item-content {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;
      min-width: 0;
    }
    
    .chat-icon {
      width: 18px;
      height: 18px;
      color: var(--primary-color);
      flex-shrink: 0;
    }
    
    .chat-item-text {
      flex: 1;
      min-width: 0;
    }
    
    .chat-item-title {
      font-weight: 500;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .chat-item-preview {
      font-size: 0.8rem;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .chat-delete-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: transparent;
      color: var(--text-color);
      opacity: 0.6;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    
    .chat-delete-btn:hover {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error-color);
      opacity: 1;
    }
    
    .chat-delete-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .header {
      padding: 16px;
      background: var(--primary-color);
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 8px var(--shadow-color);
      z-index: 1;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .sidebar-toggle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .sidebar-toggle:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .sidebar-toggle svg {
      width: 20px;
      height: 20px;
    }

    .header h2 {
      margin: 0;
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .theme-toggle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .theme-toggle svg {
      width: 20px;
      height: 20px;
    }
    
    .clear-chat {
      padding: 6px 12px;
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 16px;
      color: white;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    
    .clear-chat:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .clear-chat svg {
      width: 16px;
      height: 16px;
    }

    .status {
      font-size: 0.85rem;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }
    
    .typing-dots {
      display: inline-flex;
    }
    
    .typing-dots span {
      animation: typingDot 1.4s infinite;
      font-size: 1.2rem;
      line-height: 0.7;
    }
    
    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typingDot {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-2px); }
    }
    
    .controls-container {
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.03);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .model-select-container {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }
    
    .model-selector {
      background-color: var(--background-color);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: var(--border-radius);
      color: var(--text-color);
      padding: 6px 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .model-selector:hover {
      border-color: var(--primary-color);
    }
    
    .theme-select-container {
      position: relative;
      margin-right: 8px;
    }
    
    .theme-selector {
      background-color: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 16px;
      color: white;
      padding: 6px 12px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      padding-right: 24px;
    }
    
    .theme-selector:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
    }
    
    .theme-select-container::after {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid white;
      pointer-events: none;
    }

    .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      scroll-behavior: smooth;
      background-size: 20px 20px;
      position: relative;
    }
    
    /* Optional subtle grid pattern for the messages background */
    .chat-container[data-theme="modern-purple"] .messages,
    .chat-container[data-theme="light-minimal"] .messages {
      background-image: 
        linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
    }
    
    .chat-container[data-theme="neon-future"] .messages {
      background-image: 
        linear-gradient(to right, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 0, 255, 0.03) 1px, transparent 1px);
    }

    .message {
      display: flex;
      gap: 12px;
      max-width: 90%;
      animation: fade-in 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
      position: relative;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .message.feedback-positive .message-content {
      border: 1px solid var(--success-color);
    }
    
    .message.feedback-negative .message-content {
      border: 1px solid var(--error-color);
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 2px 10px var(--shadow-color);
      position: relative;
      overflow: hidden;
    }

    .message.user .avatar {
      background: var(--primary-color);
      background: var(--primary-gradient);
    }

    .message.assistant .avatar {
      background: #4a4a4a;
      background: linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%);
    }
    
    .ai-avatar {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ai-icon {
      width: 24px;
      height: 24px;
      z-index: 1;
    }
    
    .ai-circles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .ai-circle {
      position: absolute;
      border-radius: 50%;
      background: var(--primary-color);
      opacity: 0.15;
      transform-origin: center;
    }
    
    .ai-circle:nth-child(1) {
      width: 100%;
      height: 100%;
      animation: pulse 3s infinite;
    }
    
    .ai-circle:nth-child(2) {
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      animation: pulse 3s infinite 0.5s;
    }
    
    .ai-circle:nth-child(3) {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      animation: pulse 3s infinite 1s;
    }
    
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.2; }
      50% { transform: scale(1.1); opacity: 0.3; }
      100% { transform: scale(0.8); opacity: 0.2; }
    }

    .avatar svg {
      width: 20px;
      height: 20px;
    }
    
    .message-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 100%;
    }

    .message-content {
      padding: 14px 18px;
      border-radius: var(--border-radius);
      box-shadow: 0 2px 10px var(--shadow-color);
      line-height: 1.6;
      font-size: 0.95rem;
      position: relative;
      transition: all 0.3s ease;
      z-index: 1;
    }
    
    .message-content::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      top: 14px;
      border: 8px solid transparent;
      z-index: 0;
    }

    .message.user .message-content {
      background: var(--primary-color);
      background: var(--primary-gradient);
      color: white;
      border-top-right-radius: 4px;
      align-self: flex-end;
    }
    
    .message.user .message-content::before {
      right: -14px;
      border-left-color: var(--primary-color);
    }

    .message.assistant .message-content {
      background-color: var(--message-assistant-bg);
      border-top-left-radius: 4px;
    }
    
    .message.assistant .message-content::before {
      left: -14px;
      border-right-color: var(--message-assistant-bg);
    }
    
    .message.assistant .message-content code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 2px 5px;
      border-radius: 4px;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    .message.assistant .message-content pre {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 8px 0;
    }
    
    .message.assistant .message-content pre code {
      background-color: transparent;
      padding: 0;
      display: block;
      line-height: 1.5;
    }
    
    .message.assistant .message-content pre code.highlighted {
      color: var(--primary-color);
    }

    .message.assistant.latest .message-content::after {
      content: '';
      display: inline-block;
      width: 3px;
      height: 14px;
      background-color: var(--primary-color);
      margin-left: 4px;
      border-radius: 1px;
      animation: blink 1s infinite;
      vertical-align: middle;
    }
    
    .message-time {
      font-size: 0.7rem;
      opacity: 0.6;
      margin-top: 2px;
      align-self: flex-end;
    }
    
    .message.user .message-time {
      margin-right: 8px;
    }
    
    .message.assistant .message-time {
      margin-left: 8px;
    }
    
    /* Memory Panel Styles */
    .memory-panel {
      position: absolute;
      right: 0;
      top: 65px;
      bottom: 80px;
      width: 0;
      background-color: var(--background-color);
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: -5px 0 15px var(--shadow-color);
      transition: width 0.3s ease;
      overflow: hidden;
      z-index: 10;
      display: flex;
      flex-direction: column;
    }
    
    .memory-panel.active {
      width: 350px;
    }
    
    .memory-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: var(--primary-color);
      color: white;
      font-weight: 600;
    }
    
    .close-memory {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
    }
    
    .memory-content {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
    }
    
    .memory-item {
      background-color: var(--secondary-color);
      border-radius: var(--border-radius);
      padding: 12px;
      margin-bottom: 15px;
      border-left: 3px solid var(--primary-color);
    }
    
    .memory-item-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 8px;
    }
    
    .memory-item-text {
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .memory-stats {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      background-color: var(--secondary-color);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 0.8rem;
      color: var(--text-color);
    }
    
    .message-actions {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
      align-self: flex-end;
    }
    
    .message:hover .message-actions {
      opacity: 1;
    }
    
    .action-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: var(--secondary-color);
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px var(--shadow-color);
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px var(--shadow-color);
    }
    
    .action-btn svg {
      width: 16px;
      height: 16px;
    }
    
    .action-btn.copied {
      background-color: var(--success-color);
      color: white;
    }
    
    .feedback-btn.positive:hover {
      background-color: var(--success-color);
      color: white;
    }
    
    .feedback-btn.negative:hover {
      background-color: var(--error-color);
      color: white;
    }

    .input-container {
      padding: 16px 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      background-color: var(--background-color);
      z-index: 1;
      position: relative;
    }
    
    .input-container::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 0;
      right: 0;
      height: 10px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.05), transparent);
      pointer-events: none;
    }

    form {
      display: flex;
      gap: 10px;
      position: relative;
    }
    
    .message-input-container {
      flex-grow: 1;
      position: relative;
    }

    .message-input {
      width: 100%;
      padding: 14px 16px;
      padding-right: 40px;
      border: none;
      border-radius: 24px;
      background-color: var(--input-background);
      color: var(--text-color);
      outline: none;
      font-family: inherit;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px var(--shadow-color);
      font-size: 0.95rem;
    }

    .message-input:focus {
      box-shadow: 0 0 0 2px var(--primary-color), 0 4px 15px var(--shadow-color);
    }
    
    .message-input.is-typing {
      box-shadow: 0 0 0 2px var(--accent-color), 0 4px 15px var(--shadow-color);
    }
    
    .input-actions {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .input-action-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: none;
      background-color: transparent;
      color: var(--text-color);
      opacity: 0.6;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .input-action-btn:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .input-action-btn svg {
      width: 16px;
      height: 16px;
    }

    .send-button {
      background: var(--primary-color);
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 50%;
      width: 46px;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      outline: none;
      box-shadow: 0 2px 10px var(--shadow-color);
      flex-shrink: 0;
    }

    .send-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 20px var(--shadow-color);
    }

    .send-button:active {
      transform: translateY(0) scale(0.95);
    }

    .send-button svg {
      width: 22px;
      height: 22px;
      transition: transform 0.2s ease;
    }
    
    .send-button:hover svg {
      transform: translateX(2px);
    }

    .send-button:disabled, .message-input:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    /* Loading container */
    .loading-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--background-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: opacity 0.5s ease;
    }
    
    .loading-container.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .loading-logo {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    
    .progress-container {
      width: 80%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background-color: var(--secondary-color);
      overflow: hidden;
    }
    
    .progress-bar::-webkit-progress-bar {
      background-color: var(--secondary-color);
      border-radius: 4px;
    }
    
    .progress-bar::-webkit-progress-value {
      background: var(--primary-gradient);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .progress-bar::-moz-progress-bar {
      background: var(--primary-gradient);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.9rem;
      color: var(--text-color);
      text-align: center;
    }
    
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
    
    /* Responsive adjustments */
    @media (min-width: 768px) {
      .chat-sidebar {
        width: 0px;
        visibility: hidden;
        transform: translateX(-100%);
      }
    }
    
    .chat-container.sidebar-open .chat-sidebar {
      width: 280px;
      visibility: visible;
      transform: translateX(0);
    }
    
    @media (max-width: 768px) {
      .message {
        max-width: 95%;
      }
      
      .header h2 {
        font-size: 1rem;
      }
      
      .theme-select-container {
        display: none;
      }
    }
  `;
}

/**
 * Default theme configurations
 * @returns {Object} Theme configuration object
 */
export function getDefaultThemes() {
  return {
    'myTheme': {
      primaryColor: '#00A9E0',
      primaryGradient: 'linear-gradient(135deg, #00A9E0 0%, #0568AE 100%)',
      secondaryColor: '#F2F2F2',
      textColor: '#2A2A2A',
      backgroundColor: '#FFFFFF',
      inputBackground: '#F2F2F2',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      messageUserBg: '#00A9E0',
      messageAssistantBg: '#F2F2F2',
      sidebarBg: '#F8F9FA',
      accentColor: '#FF7F32',
      successColor: '#4CAF50',
      errorColor: '#F44336',
      warningColor: '#FFC107',
      borderRadius: '8px',
      fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif"
    },
    'dark-sleek': {
      primaryColor: '#00bcd4',
      primaryGradient: 'linear-gradient(135deg, #00bcd4 0%, #006064 100%)',
      secondaryColor: '#2d2d30',
      textColor: '#e0e0e0',
      backgroundColor: '#121212',
      inputBackground: '#1e1e1e',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      messageUserBg: '#006064',
      messageAssistantBg: '#1e1e1e',
      sidebarBg: '#121212',
      accentColor: '#00E5FF',
      borderRadius: '8px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    'neon-future': {
      primaryColor: '#ff00ff',
      primaryGradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
      secondaryColor: '#1a1a1a',
      textColor: '#ffffff',
      backgroundColor: '#000000',
      inputBackground: '#1a1a1a',
      shadowColor: 'rgba(255, 0, 255, 0.2)',
      messageUserBg: 'rgba(0, 255, 255, 0.1)',
      messageAssistantBg: 'rgba(255, 0, 255, 0.1)',
      sidebarBg: '#0a0a0a',
      accentColor: '#00ffff',
      borderRadius: '0px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    }
  };
}