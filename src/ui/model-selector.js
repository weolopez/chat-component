/**
 * Model selector UI component
 */
export function renderModelSelector(availableModels, selectedModel) {
  return `
    <div class="controls-container">
      <div class="model-select-container">
        <label for="model-selector">Model:</label>
        <select class="model-selector" id="model-selector">
          ${availableModels.map(model => 
            `<option value="${model.id}" ${model.id === selectedModel ? 'selected' : ''}>${model.name}</option>`
          ).join('')}
        </select>
      </div>
    </div>
  `;
}