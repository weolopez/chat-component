/**
 * Chat header UI component
 */
export function renderChatHeader(component) {
  return `
    <div class="header">
      <div class="header-content">
        <button class="sidebar-toggle" title="Toggle sidebar">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>
        <h2>AI Chat</h2>
        <div class="status">Ready</div>
      </div>
      <div class="header-actions">
        <div class="theme-select-container">
          <select class="theme-selector">
            ${component.themeService.availableThemes.map(theme => 
              `<option value="${theme}">${theme.charAt(0).toUpperCase() + theme.slice(1).replace(/-/g, ' ')}</option>`
            ).join('')}
          </select>
        </div>
        <button class="theme-toggle" title="Change theme">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"></path>
            <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"></path>
          </svg>
        </button>
        <button class="memory-toggle" title="Show memory">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"></path>
          </svg>
        </button>
        <button class="clear-chat" title="Clear chat">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
          </svg>
          Clear
        </button>
      </div>
    </div>
  `;
}