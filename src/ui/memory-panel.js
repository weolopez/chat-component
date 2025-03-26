/**
 * Memory panel UI component
 */
export function renderMemoryPanel() {
  return `
    <div class="memory-panel">
      <div class="memory-header">
        <span>AI Memory</span>
        <button class="close-memory">×</button>
      </div>
      <div class="memory-content">
        <!-- Will be populated dynamically -->
      </div>
      <div class="memory-stats">
        <div>Recent context: <span id="recentCount">0</span> items</div>
        <div>Total memories: <span id="totalCount">0</span> items</div>
      </div>
    </div>
  `;
}