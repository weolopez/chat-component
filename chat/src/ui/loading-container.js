/**
 * Loading container UI component
 */
export function renderLoadingContainer() {
  return `
    <div class="loading-container">
      <div class="loading-logo">
        <svg viewBox="0 0 36 36">
          <path fill="var(--primary-color)" d="M18,2 C9.163,2 2,9.163 2,18 C2,26.837 9.163,34 18,34 C26.837,34 34,26.837 34,18 C34,9.163 26.837,2 18,2 Z M18,6 C16.895,6 16,6.895 16,8 C16,9.105 16.895,10 18,10 C19.105,10 20,9.105 20,8 C20,6.895 19.105,6 18,6 Z M18,29 C14.134,29 11,25.866 11,22 C11,18.134 14.134,15 18,15 C21.866,15 25,18.134 25,22 C25,25.866 21.866,29 18,29 Z"></path>
        </svg>
      </div>
      <div class="progress-container">
        <progress class="progress-bar" value="0" max="100"></progress>
        <div class="progress-text">Initializing model...</div>
      </div>
    </div>
  `;
}