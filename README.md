# WebLLM Chat Component

A modern, sleek web component for AI chat interactions powered by WebLLM, refactored for improved maintainability and extensibility.

## Features

- Native Web Component with no build step required
- Modular architecture for easier maintenance and extension
- Web Worker-based processing for smooth UI
- Memory system with vector database for contextual conversations
- Knowledge base integration for retrieving relevant information
- Modern, responsive design with multiple theme options
- Streaming responses with visual typing indication
- Built on WebLLM for in-browser AI inference
- Loads dependencies from CDN - no npm install needed

## Demo

To run the demo locally:

```bash
# Install http-server if you don't have it
npm install -g http-server

# Start the server in the project directory
http-server

# Navigate to http://localhost:8080 in your browser
```

## Browser Requirements

- Modern browser with Web Components support
- WebGPU support for optimal performance (Chrome/Edge 113+, Firefox 113+ with flags)

## Usage

### Basic Usage

Add the component to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chat Component Demo</title>
  <style>
    body, html {
      height: 100%;
      margin: 0;
    }
  </style>
</head>
<body>
  <chat-component></chat-component>
  
  <script type="module" src="path/to/chat-component.js"></script>
</body>
</html>
```

### Advanced Usage

The component supports customization via attributes:

```html
<chat-component 
  brand="custom" 
  primary-color="#6200ee" 
  accent-color="#03dac6" 
  border-radius="12px"
  font-family="'Roboto', sans-serif">
</chat-component>
```

## Project Structure

The codebase has been refactored into a modular architecture:

```
chat-component/
├── src/                    # Source code
│   ├── components/         # Web components
│   │   └── chat-component.js   # Main component class
│   ├── services/           # Business logic
│   │   ├── chat-service.js     # Chat messaging service
│   │   ├── memory-service.js   # Memory management service
│   │   └── theme-service.js    # Theme customization service
│   ├── ui/                 # UI components
│   │   ├── chat-header.js      # Header UI
│   │   ├── chat-input.js       # Input area UI
│   │   ├── chat-sidebar.js     # Sidebar UI
│   │   ├── loading-container.js # Loading UI
│   │   ├── memory-panel.js     # Memory panel UI
│   │   └── model-selector.js   # Model selector UI
│   ├── utils/              # Utilities
│   │   ├── markdown-formatter.js # Markdown processing
│   │   ├── storage.js          # Local storage utilities
│   │   └── time-formatter.js   # Time formatting utilities
│   ├── styles/             # Styles
│   │   └── chat-styles.js      # Component styles
│   └── index.js            # Main entry point
├── lib/                    # Core libraries
│   ├── entity-db.js        # Vector database
│   ├── knowledge-loader.js # Knowledge base loader
│   └── memory-manager.js   # Memory manager
├── knowledge/              # Knowledge base files
│   ├── example.md          # Example knowledge document
│   └── index.json          # Knowledge base index
├── chat-component.js       # Legacy entry point
├── chat-worker.js          # Web worker for LLM inference
├── index.html              # Demo page
└── README.md               # This file
```

## API

### Attributes

- `brand` - Base brand theme (att, dark-sleek, neon-future)
- `primary-color` - Main color for UI elements
- `accent-color` - Secondary accent color
- `border-radius` - Border radius for UI elements
- `font-family` - Font family for text

### Themes

The component comes with several built-in themes:

- `att` - AT&T branded theme (default)
- `dark-sleek` - Modern dark theme with blue accents
- `neon-future` - Cyberpunk-inspired theme with neon colors

### CSS Variables

- `--primary-color` - Accent color for UI elements
- `--primary-gradient` - Gradient for UI elements
- `--secondary-color` - Secondary background color
- `--text-color` - Text color
- `--background-color` - Background color
- `--input-background` - Background for input field
- `--shadow-color` - Color for shadows
- `--message-user-bg` - Background for user messages
- `--message-assistant-bg` - Background for assistant messages
- `--sidebar-bg` - Background for sidebar
- `--accent-color` - Accent color for highlights
- `--font-family` - Font family

## Technical Details

- Uses WebLLM for in-browser LLM inference 
- Implements Shadow DOM for style encapsulation
- Follows modern ES module patterns
- Offloads model processing to web workers for UI responsiveness
- Uses IndexedDB for memory storage via entity-db
- Supports markdown rendering in messages

## License

MIT