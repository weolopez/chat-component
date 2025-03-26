/**
 * CSS styles for the ChatComponent
 * This file contains the CSS styles that will be used to style the chat component
 */

export function getStyles() {
  return `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      font-family: var(--font-family);
    }
    
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
    
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    .header {
      padding: 16px;
      background: var(--primary-gradient);
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
      font-size: 0.85rem;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .theme-toggle, .memory-toggle {
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
    
    .theme-toggle:hover, .memory-toggle:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
    
    .theme-toggle svg, .memory-toggle svg {
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

    .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      scroll-behavior: smooth;
      position: relative;
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
      background: var(--primary-gradient);
    }

    .message.assistant .avatar {
      background: linear-gradient(135deg, #4a4a4a 0%, #2d2d2d 100%);
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

    .message.user .message-content {
      background: var(--primary-gradient);
      color: white;
      border-top-right-radius: 4px;
      align-self: flex-end;
    }

    .message.assistant .message-content {
      background-color: var(--message-assistant-bg);
      border-top-left-radius: 4px;
    }
    
    .message-time {
      font-size: 0.7rem;
      opacity: 0.6;
      margin-top: 2px;
      align-self: flex-end;
    }
    
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
    
    .memory-stats {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      background-color: var(--secondary-color);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 0.8rem;
      color: var(--text-color);
    }

    .input-container {
      padding: 16px 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      background-color: var(--background-color);
      z-index: 1;
      position: relative;
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
    
    .input-action-btn svg {
      width: 16px;
      height: 16px;
    }

    .send-button {
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

    .send-button svg {
      width: 22px;
      height: 22px;
    }
    
    .send-button:disabled, .message-input:disabled {
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
      z-index: 20;
      padding: 20px;
      text-align: center;
      backdrop-filter: blur(5px);
    }

    .loading-container.hidden {
      display: none;
    }
    
    .loading-content {
      background-color: var(--background-color);
      padding: 30px;
      border-radius: var(--border-radius);
      box-shadow: 0 10px 50px var(--shadow-color);
      max-width: 500px;
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .progress-container {
      width: 100%;
      max-width: 300px;
      margin-top: 20px;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background-color: var(--input-background);
      overflow: hidden;
      position: relative;
    }

    .progress-text {
      margin-top: 10px;
      font-size: 0.9rem;
      color: var(--text-color);
      animation: fade-in 0.5s ease;
    }
    
    @keyframes scale-in {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
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

    @media (max-width: 768px) {
      .chat-container {
        border-radius: 0;
        height: 100vh;
      }
      
      .message {
        max-width: 95%;
      }
    }
  `;
}