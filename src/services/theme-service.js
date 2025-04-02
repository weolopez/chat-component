/**
 * Theme management service
 */
import { getDefaultThemes } from '../styles/chat-styles.js';
import { getActiveTheme, saveActiveTheme } from '../utils/storage.js';

export class ThemeService {
  constructor(element, initialBrand = 'myTheme') {
    this.element = element;
    this.brand = initialBrand;
    this.defaultThemes = getDefaultThemes();
    this.availableThemes = Object.keys(this.defaultThemes);
    this.theme = getActiveTheme(this.brand);
  }

  /**
   * Process custom branding attributes
   * @param {Object} attributes - Custom branding attributes
   */
  processCustomBranding(attributes) {
    const customBranding = {};
    
    if (attributes.primaryColor) {
      customBranding.primaryColor = attributes.primaryColor;
    }
    if (attributes.accentColor) {
      customBranding.accentColor = attributes.accentColor;
    }
    if (attributes.borderRadius) {
      customBranding.borderRadius = attributes.borderRadius;
    }
    if (attributes.fontFamily) {
      customBranding.fontFamily = attributes.fontFamily;
    }
    
    // Add custom branding if provided
    if (Object.keys(customBranding).length > 0) {
      this.defaultThemes['custom'] = {
        ...this.defaultThemes[this.brand],
        ...customBranding
      };
      this.theme = 'custom';
      this.availableThemes = Object.keys(this.defaultThemes);
    }
  }

  /**
   * Apply the current theme to the component
   */
  applyTheme() {
    const container = this.element.shadowRoot.querySelector('.chat-container');
    container.setAttribute('data-theme', this.theme);
    
    // First, clear any previous inline styles to ensure clean slate
    container.removeAttribute('style');
    
    // Apply all CSS variables based on theme
    const themeConfig = this.defaultThemes[this.theme];
    if (themeConfig) {
      Object.keys(themeConfig).forEach(key => {
        // Convert camelCase to kebab-case for CSS vars
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        container.style.setProperty(`--${cssVarName}`, themeConfig[key]);
      });
      
      // Force update critical values on the :host element too for better specificity
      const hostStyle = document.createElement('style');
      let hostCss = ':host {';
      Object.keys(themeConfig).forEach(key => {
        const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        hostCss += `--${cssVarName}: ${themeConfig[key]};`;
      });
      hostCss += '}';
      
      // Apply the host styles
      hostStyle.textContent = hostCss;
      this.element.shadowRoot.appendChild(hostStyle);
    }
  }

  /**
   * Change to a new theme
   * @param {string} newTheme - Name of the new theme
   */
  changeTheme(newTheme) {
    if (this.availableThemes.includes(newTheme)) {
      this.theme = newTheme;
      saveActiveTheme(newTheme);
      this.applyTheme();
    }
  }

  /**
   * Cycle to the next available theme
   */
  cycleTheme() {
    const currentIndex = this.availableThemes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % this.availableThemes.length;
    this.changeTheme(this.availableThemes[nextIndex]);
  }
}