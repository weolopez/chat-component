/**
 * Utility functions for the chat component
 */

/**
 * Convert markdown text to HTML
 * @param {string} text - The markdown text to convert
 * @returns {string} The HTML representation of the markdown
 */
export function markdownToHtml(text) {
  // Very simple markdown parser for common elements
  return text
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Lists
    .replace(/^\s*- (.*$)/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br>');
}

/**
 * Apply syntax highlighting to code blocks
 * @param {HTMLElement} element - The element containing code blocks
 */
export function highlightCodeBlocks(element) {
  const codeBlocks = element.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.classList.add('highlighted');
  });
}

/**
 * Format a timestamp into a readable time string
 * @param {string} timestamp - The ISO timestamp to format
 * @returns {string} The formatted time string
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
export function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert camelCase to kebab-case
 * @param {string} str - The camelCase string to convert
 * @returns {string} The kebab-case string
 */
export function camelToKebab(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Convert kebab-case to camelCase
 * @param {string} str - The kebab-case string to convert
 * @returns {string} The camelCase string
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle a function call
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} The throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Safely parse JSON with a fallback value
 * @param {string} json - The JSON string to parse
 * @param {*} fallback - The fallback value if parsing fails
 * @returns {*} The parsed object or fallback value
 */
export function safeJsonParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('JSON parse error:', e);
    return fallback;
  }
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} The truncated string
 */
export function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}