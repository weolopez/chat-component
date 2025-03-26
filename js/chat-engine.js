/**
 * ChatEngine - Handles the core chat functionality including worker initialization,
 * message processing, and response handling.
 */
export class ChatEngine {
  constructor(options = {}) {
    this.isProcessing = false;
    this.modelLoaded = false;
    this.selectedModel = options.selectedModel || "Qwen2.5-0.5B-Instruct-q0f16-MLC";
    this.availableModels = options.availableModels || [
      { id: "Qwen2.5-0.5B-Instruct-q0f16-MLC", name: "Qwen 0.5B (Fast)" },
      { id: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC", name: "DeepSeek 7B (Smart)" }
    ];
    this.worker = null;
    this.callbacks = {
      onInitProgress: options.onInitProgress || (() => {}),
      onInitComplete: options.onInitComplete || (() => {}),
      onResponseChunk: options.onResponseChunk || (() => {}),
      onResponseComplete: options.onResponseComplete || (() => {}),
      onError: options.onError || (() => {}),
      onStatusUpdate: options.onStatusUpdate || (() => {})
    };
  }

  /**
   * Initialize the worker and set up message handling
   */
  initWorker() {
    this.worker = new Worker('../chat-worker.js', { type: 'module' });
    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    
    // Initialize the model
    this.worker.postMessage({ 
      type: 'init', 
      model: this.selectedModel 
    });
    
    this.callbacks.onStatusUpdate('Initializing model...');
  }

  /**
   * Handle messages from the worker
   * @param {MessageEvent} event - The message event from the worker
   */
  handleWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch(type) {
      case 'init-progress':
        this.callbacks.onInitProgress(data);
        break;
      case 'init-complete':
        this.modelLoaded = true;
        this.callbacks.onStatusUpdate('Model loaded');
        this.callbacks.onInitComplete();
        break;
      case 'response-chunk':
        this.callbacks.onResponseChunk(data.text);
        break;
      case 'response-complete':
        this.callbacks.onResponseComplete(data.message);
        this.isProcessing = false;
        break;
      case 'error':
        this.callbacks.onError(data.error);
        this.isProcessing = false;
        break;
    }
  }

  /**
   * Change the model and reinitialize the worker
   * @param {string} newModel - The ID of the new model to use
   */
  changeModel(newModel) {
    if (newModel !== this.selectedModel) {
      this.selectedModel = newModel;
      this.modelLoaded = false;
      
      // Terminate the existing worker and initialize a new one
      if (this.worker) {
        this.worker.terminate();
      }
      this.initWorker();
      return true;
    }
    return false;
  }

  /**
   * Send a message to generate a response
   * @param {Array} messages - The message history
   * @param {Object} context - Optional context for the message
   */
  generateResponse(messages, context = {}) {
    if (!this.modelLoaded || this.isProcessing) {
      return false;
    }
    
    this.isProcessing = true;
    
    // Send to worker
    this.worker.postMessage({
      type: 'generate',
      messages: messages,
      model: this.selectedModel,
      context: context
    });
    
    return true;
  }

  /**
   * Clean up resources when the engine is no longer needed
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}