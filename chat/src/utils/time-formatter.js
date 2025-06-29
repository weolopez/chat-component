/**
 * Time formatting utilities
 */

/**
 * Format a timestamp into a localized time string
 * @param {string} timestamp - ISO timestamp to format
 * @returns {string} - Formatted time string
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}