class ModeSelectorComponent extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          max-height: 600px;
          overflow-y: auto;
          z-index: 1;
          position: absolute;
          right: 0px;
          bottom: 99px;
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: var(--text-color);
          background-color: rgba(0, 169, 224, 0.9);
          border-right: 1px solid var(--border-color);
          width: 300px; /* Example width, adjust as needed */
          box-sizing: border-box;
          padding: 10px;
        }

        .mode-selector-container {
          padding: 10px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .header h2 {
          font-size: 1.2em;
          font-weight: 600;
          margin: 0;
          color: var(--header-text-color);
        }

        .header-icons .icon {
          fill: var(--icon-color);
          margin-left: 10px;
          cursor: pointer;
        }

        .header-icons .icon:hover {
          fill: var(--header-text-color);
        }

        .description {
          font-size: 0.85em;
          color: var(--description-color);
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .mode-list {
            /* Add any specific styling for the list container if needed */
        }

        .mode-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          margin-bottom: 5px;
          border-radius: 3px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .mode-item:hover {
          background-color: var(--hover-background-color);
        }

        .mode-item.selected {
          background-color: var(--selected-background-color);
          color: var(--selected-text-color);
        }

        .mode-item.selected .mode-icon,
        .mode-item.selected .mode-name,
        .mode-item.selected .mode-description {
          color: var(--selected-text-color);
        }

        .mode-icon {
          font-size: 1.5em; /* Adjust icon size */
          margin-right: 10px;
          color: var(--icon-color);
          border-radius: 14px;
          padding: 10px;
        }

        .mode-details {
          flex-grow: 1;
        }

        .mode-name {
          font-weight: 500;
          font-size: 1em;
          margin-bottom: 2px;
          color: var(--text-color);
        }

        .mode-description {
          font-size: 0.8em;
          color: var(--description-color);
        }

        .checkmark-icon {
          margin-left: auto;
          font-size: 1.2em;
          color: var(--selected-text-color);
          display: none; /* Hidden by default */
        }

        .mode-item.selected .checkmark-icon {
          display: block; /* Show checkmark when selected */
        }
      </style>
      <div class="mode-selector-container">
        <div class="header">
          <h2>Modes</h2>
          <div class="header-icons">
            <!-- Placeholder for marketplace icon -->
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <!-- Placeholder for settings icon -->
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.09-.74-1.71-.98L14.8 2.8c-.09-.23-.3-.39-.55-.39h-4c-.25 0-.46.16-.55.39L9.25 5.35c-.62.24-1.19.58-1.71.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.09.74 1.71.98l.36 2.54c.09.23.3.39.55.39h4c.25 0 .46-.16.55-.39l.36-2.54c.62-.24 1.19-.58 1.71-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-2.03-2.83c.07.27.13.56.13.85s-.06.58-.13.85l1.86 1.45-1.35 2.34-2.34-.96c-.46.36-.96.65-1.47.86l-.36 2.54h-2.77l-.36-2.54c-.51-.21-1.01-.5-1.47-.86l-2.34.96-1.35-2.34 1.86-1.45c-.07-.27-.13-.56-.13-.85s.06-.58.13-.85L6.22 9.2l1.35-2.34 2.34.96c.46-.36.96-.65 1.47-.86l.36-2.54h2.77l-.36-2.54c-.51-.21-1.01-.5-1.47-.86l2.34-.96 1.35 2.34-1.86 1.45zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </div>
        </div>
        <p class="description">Specialized personas that tailor Ask Architect's behavior.</p>
        <div class="mode-list">
          <!-- Mode items will be dynamically inserted here -->
        </div>
      </div>
    `;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.modesData = []; // This will hold the parsed modes data
    this.selectedModeSlug = null; // To keep track of the currently selected mode
  }

  connectedCallback() {
    this.renderModes();
  }

  /**
   * Sets the modes data for the component.
   * @param {Array<Object>} modes - An array of mode objects.
   */
  set modes(modes) {
    this.modesData = modes;
    this.renderModes();
  }

  /**
   * Sets the currently selected mode by its slug.
   * @param {string} slug - The slug of the mode to select.
   */
  setSelectedMode(slug) {
    // if (this.selectedModeSlug === slug) return; // No change needed

    const oldSelected = this.shadowRoot.querySelector(`.mode-item.selected`);
    if (oldSelected) {
      oldSelected.classList.remove('selected');
    }

    const newSelected = this.shadowRoot.querySelector(`[data-slug="${slug}"]`);
    if (newSelected) {
      newSelected.classList.add('selected');
      this.selectedModeSlug = slug;
      //add slug to modeselectorcomponent data-slug attribute
      // this.shadowRoot.querySelector('.mode-selector-container').setAttribute('data-slug', slug);
    }
  }

  renderModes() {
    const modeListContainer = this.shadowRoot.querySelector('.mode-list');
    modeListContainer.innerHTML = ''; // Clear existing modes

    this.modesData.forEach(mode => {
      const modeItem = document.createElement('div');
      modeItem.classList.add('mode-item');
      modeItem.setAttribute('data-slug', mode.slug); // Store slug for identification

      // Extract icon and clean name
      const iconMatch = mode.name.match(/^(\S+)\s(.+)$/);
      const icon = iconMatch ? iconMatch[1] : '';
      const name = iconMatch ? iconMatch[2] : mode.name;

      modeItem.innerHTML = `
        <span class="mode-icon" style="background: ${mode.backgroundColor || 'transparent'}">${icon}</span>
        <div class="mode-details">
          <div class="mode-name">${name}</div>
          <div class="mode-description">${mode.roleDefinition.split('\n')[0]}</div>
        </div>
        <svg class="checkmark-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      `;

      modeItem.addEventListener('click', () => this.handleModeClick(mode.slug));
      modeListContainer.appendChild(modeItem);
    });

    // Re-apply selection after re-rendering if a mode was previously selected
    if (this.selectedModeSlug) {
      this.setSelectedMode(this.selectedModeSlug);
    }
  }

  handleModeClick(slug) {
    this.setSelectedMode(slug); // Update UI selection

    // Dispatch custom event
    const event = new CustomEvent('mode-selected', {
      bubbles: true, // Allow event to bubble up through the DOM
      composed: true, // Allow event to cross the shadow DOM boundary
      detail: {
        slug: slug,
        modeData: this.modesData.find(m => m.slug === slug) // Include full mode data
      }
    });
    this.dispatchEvent(event);
    console.log(`Mode selected: ${slug}`); // For debugging
  }
}

customElements.define('mode-selector', ModeSelectorComponent);