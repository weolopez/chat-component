/**
 * ThemeManager - Handles theme configuration, storage, and application
 */
export class ThemeManager {
  constructor(options = {}) {
    this.brand = options.brand || 'att';
    this.defaultThemes = {
      'att': {
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
    
    // Apply custom branding if provided
    this.customBranding = options.customBranding || {};
    if (Object.keys(this.customBranding).length > 0) {
      this.defaultThemes['custom'] = {
        ...this.defaultThemes[this.brand],
        ...this.customBranding
      };
      this.theme = 'custom';
    } else {
      // Get theme from localStorage or default to brand
      this.theme = localStorage.getItem('chat-theme') || this.brand;
    }
    
    // Add available themes to the component
    this.availableThemes = Object.keys(this.defaultThemes);
  }

  /**
   * Apply the current theme to a container element
   * @param {HTMLElement} container - The container to apply the theme to
   */
  applyTheme(container) {
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
      
      console.log(`Applied theme: ${this.theme}`);
      return true;
    }
    
    return false;
  }

  /**
   * Apply host styles to a shadow root
   * @param {ShadowRoot} shadowRoot - The shadow root to apply styles to
   */
  applyHostStyles(shadowRoot) {
    const themeConfig = this.defaultThemes[this.theme];
    if (themeConfig) {
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
      shadowRoot.appendChild(hostStyle);
      
      return true;
    }
    
    return false;
  }

  /**
   * Change the current theme
   * @param {string} newTheme - The name of the theme to switch to
   */
  changeTheme(newTheme) {
    if (this.availableThemes.includes(newTheme)) {
      this.theme = newTheme;
      localStorage.setItem('chat-theme', this.theme);
      return true;
    }
    return false;
  }

  /**
   * Cycle to the next theme
   */
  cycleTheme() {
    const themes = this.availableThemes;
    const currentIndex = themes.indexOf(this.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.theme = themes[nextIndex];
    localStorage.setItem('chat-theme', this.theme);
    return this.theme;
  }

  /**
   * Get the current theme name
   */
  getCurrentTheme() {
    return this.theme;
  }

  /**
   * Get all available themes
   */
  getAvailableThemes() {
    return this.availableThemes;
  }

  /**
   * Get theme configuration for a specific theme
   * @param {string} themeName - The name of the theme to get configuration for
   */
  getThemeConfig(themeName) {
    return this.defaultThemes[themeName || this.theme];
  }

  /**
   * Add a new theme
   * @param {string} name - The name of the new theme
   * @param {Object} config - The theme configuration
   */
  addTheme(name, config) {
    if (!this.defaultThemes[name]) {
      this.defaultThemes[name] = config;
      this.availableThemes = Object.keys(this.defaultThemes);
      return true;
    }
    return false;
  }
}