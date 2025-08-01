import { ApiService } from './api-service.js';
import { HistoryService } from './history-service.js';
import { MemoryManager } from './memory-manager.js';
import { KnowledgeLoader } from './knowledge-loader.js';

export class ChatManager extends EventTarget {
  constructor(config = {}) {
    super();
    this.config = config;
    this.state = {
      messages: [],
      isProcessing: false,
      isInitialized: false,
      currentChatId: config.currentChatId || null,
      selectedModel: config.model || 'gpt-4o-mini'
    };

    // Initialize services
    this.apiService = new ApiService(config.api);
    this.modesData = this.apiService.modesData;
    this.historyService = new HistoryService(config.history);

    // Initialize memory and knowledge systems (optional)
    try {
      this.memoryManager = new MemoryManager(config.memory || {});
    } catch (error) {
      console.warn('Memory system not available:', error.message);
      this.memoryManager = null;
    }

    try {
      this.knowledgeLoader = new KnowledgeLoader(config.knowledge || {});
    } catch (error) {
      console.warn('Knowledge system not available:', error.message);
      this.knowledgeLoader = null;
    }

    this.availableModels = [
      { id: "Qwen2.5-0.5B-Instruct-q0f16-MLC", name: "Qwen 0.5B (Fast)" },
      { id: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC", name: "DeepSeek 7B (Smart)" }
    ];
  }

  async initialize() {
    // Initialize API service
    // await this.apiService.initialize();

    // Initialize knowledge system (memory is already initialized in constructor)
    // if (this.knowledgeLoader) {
    //   try {
    //     await this.knowledgeLoader.loadKnowledgeBase();
    //   } catch (error) {
    //     console.warn('Failed to load knowledge base:', error.message);
    //     this.knowledgeLoader = null;
    //   }
    // }

    // Load chat history
    this.historyService.loadHistory();
    this.state.currentChatId = this.historyService.activeChat;

    // Load messages for the current chat
    if (this.state.currentChatId) {
      this.state.messages = this.historyService.getMessages(this.state.currentChatId);
    }

    this.state.isInitialized = true;
    this.dispatchEvent(new CustomEvent('initialized'));

    this.loadChat(this.state.currentChatId);
  }
  updateState(userMessage) {
    this.state.messages.push(userMessage);
    this.state.isProcessing = true;

    // Emit events for UI updates
    this.dispatchEvent(new CustomEvent('messageAdded', {
      detail: { message: userMessage }
    }));

    this.dispatchEvent(new CustomEvent('stateChanged', {
      detail: { state: this.state }
    }));
  }

  getMode() { return this.apiService.getMode(); }
  setMode(mode) { this.apiService.setMode(mode); }

  async sendMessage(content, imageURL = null) {
    const userMessage = this.apiService.getUserMessage(content, imageURL);
    this.updateState(userMessage);
    await this.memoryManager.addMessage(userMessage);
    let context = await this.memoryManager.buildContext(content);
    let knowledgeResults = await this.knowledgeLoader.query(content, 3);
    const messageContext = this.memoryManager.formatContextMessages(context, content, imageURL);

    const assistantMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };
    this.state.messages.push(assistantMessage);

    this.dispatchEvent(new CustomEvent('messageAdded', {
      detail: { message: assistantMessage }
    }));

    if (knowledgeResults && knowledgeResults.length > 0) {
      let knowledgeContext = "I've found some relevant information that might help answer the question:\n\n";

      knowledgeResults.forEach((result, index) => {
        knowledgeContext += `[${index + 1}] From ${result.document?.title || 'documentation'}:\n${result.text}\n\n`;
      });

      // Add or update system message with knowledge
      if (messageContext.length > 0 && messageContext[0].role === 'system') {
        messageContext[0].content += '\n\n' + knowledgeContext;
      } else {
        messageContext.unshift({
          role: 'system',
          content: knowledgeContext
        });
      }

    } else {
      messageContext = this.state.messages.slice(0, -1)
    }
      
      // Generate response with enhanced context
      await this.generateResponse(messageContext);

    // Update and save chat history
    this.historyService.updateMessages(this.state.messages);
  }

  async generateResponse(messages) {
    try {
      // Prepare the system prompt with resume data and knowledge base
      const systemPrompt = this.apiService.createSystemPrompt();
      const tools = this.apiService.getTools();

      // Add system prompt if not present, or replace it
      if (!messages.some(msg => msg.role === 'system')) {
        messages.unshift({
          role: 'system',
          content: systemPrompt
        });
      } else {
        // Find and replace the existing system message
        const systemIndex = messages.findIndex(msg => msg.role === 'system');
        if (systemIndex !== -1) {
          messages[systemIndex].content = systemPrompt + '\n\n' + messages[systemIndex].content;
        }
      }


      // Use ApiService to generate streaming response
      const responseStream = this.apiService.streamChatCompletion(messages, {
        tools,
        temperature: 0.7,
        max_tokens: 1024
      });

      let accumulatedResponse = '';
      let final_answer
      // Process each chunk as it arrives
      for await (const chunk of responseStream) {
        final_answer = chunk.final_answer
        if (chunk.thinking) {
          accumulatedResponse += chunk.thinking + '\n'
          chunk.thinking = accumulatedResponse;
        } else if (chunk.choices && chunk.choices[0]) {
          let piece = chunk.choices[0].delta.content;
          if (piece) {
            accumulatedResponse += chunk.choices[0].delta.content;
          }
          chunk.final_answer = accumulatedResponse
          final_answer = accumulatedResponse
        }
        // Emit response update for UI
        this.dispatchEvent(new CustomEvent('responseUpdate', {
          detail: { content: chunk }
        }));
      }
      if (!final_answer) console.error('No final answer received from API, accumulated response:', accumulatedResponse);

      // Complete the response
      const assistantMessage = {
        role: 'assistant',
        content: final_answer,
        timestamp: this.state.messages[this.state.messages.length - 1].timestamp
      };

      this.state.messages[this.state.messages.length - 1] = assistantMessage;

      // Add to memory if available
      if (this.memoryManager) {
        await this.memoryManager.addMessage(assistantMessage);
      }

      this.state.isProcessing = false;

      this.dispatchEvent(new CustomEvent('responseComplete', {
        detail: { message: assistantMessage }
      }));

      this.dispatchEvent(new CustomEvent('stateChanged', {
        detail: { state: this.state }
      }));

    } catch (error) {
      console.error('Generation error:', error);
      this.state.isProcessing = false;
      this.dispatchEvent(new CustomEvent('error', {
        detail: { message: `Failed to generate response: ${error.message}` }
      }));
      throw error;
    }
  }

  createNewChat() {
    // Update current chat messages before creating new one
    if (this.state.currentChatId) {
      this.historyService.updateMessages(this.state.messages);
    }

    this.historyService.createNewChat();
    this.state.currentChatId = this.historyService.activeChat;
    this.state.messages = [];
    this.dispatchEvent(new CustomEvent('chatChanged', {
      detail: { chatId: this.state.currentChatId }
    }));
  }

  loadChat(chatId) {
    // Update current chat messages before switching
    if (this.state.currentChatId) {
      this.historyService.updateMessages(this.state.messages);
    }

    this.historyService.loadChat(chatId);
    this.state.currentChatId = chatId;
    this.state.messages = this.historyService.getMessages(chatId);

    this.dispatchEvent(new CustomEvent('chatChanged', {
      detail: { chatId }
    }));

    let chat = this.historyService.getChat(chatId);
    let modeData = this.modesData.customModes.find(m => m.slug === chat.mode);
    document.dispatchEvent(new CustomEvent('mode-selected', {
        bubbles: true, // Allow event to bubble up through the DOM
        composed: true, // Allow event to cross the shadow DOM boundary
        detail: {
          slug: chat.mode || 'default',
          modeData
        }
      }))
  }

  deleteChat(chatId) {
    this.historyService.deleteChat(chatId);
    this.state.currentChatId = this.historyService.activeChat;
    this.state.messages = this.historyService.getMessages(this.state.currentChatId);
    this.dispatchEvent(new CustomEvent('chatChanged', {
      detail: { chatId: this.state.currentChatId }
    }));
  }

  getChatHistory() {
    return this.historyService.chatHistory;
  }


  setTheme(theme) {
    this.state.theme = theme;
    this.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme }
    }));
  }

  getMessages() {
    return [...this.state.messages];
  }

  isProcessing() {
    return this.state.isProcessing;
  }

  isInitialized() {
    return this.state.isInitialized;
  }

  async getMemoryInfo() {
    console.log('ChatManager: getMemoryInfo called, memoryManager:', this.memoryManager);

    if (!this.memoryManager) {
      console.log('ChatManager: No memory manager available.');
      return {
        recentCount: 0,
        totalCount: 0,
        entities: [],
        relations: [],
        hasKnowledge: this.knowledgeLoader !== null,
        knowledgeDetails: this.knowledgeLoader ? await this.getKnowledgeDetails() : null
      };
    }

    try {
      // Get memory information from the memory manager
      const recentMessages = this.memoryManager.getRecentMessages();
      const conversationHistory = this.memoryManager.conversationHistory || [];

      console.log('ChatManager: Recent messages from memoryManager:', recentMessages);
      console.log('ChatManager: Conversation history from memoryManager:', conversationHistory);

      // Get knowledge details if available
      let knowledgeDetails = null;
      if (this.knowledgeLoader) {
        knowledgeDetails = await this.getKnowledgeDetails();
      }

      return {
        recentCount: recentMessages.length,
        totalCount: conversationHistory.length,
        recentMessages: recentMessages,
        hasKnowledge: this.knowledgeLoader !== null,
        knowledgeDetails: knowledgeDetails,
        entities: [],
        relations: []
      };
    } catch (error) {
      console.warn('ChatManager: Failed to get memory info from memoryManager:', error);
      return {
        recentCount: 0,
        totalCount: 0,
        entities: [],
        relations: [],
        hasKnowledge: this.knowledgeLoader !== null,
        knowledgeDetails: null
      };
    }
  }

  async getKnowledgeDetails() {
    if (!this.knowledgeLoader) {
      return null;
    }

    try {
      // Get loaded files information
      const loadedFiles = Array.from(this.knowledgeLoader.loadedFiles);

      // Try to get some sample knowledge entries
      let sampleEntries = [];
      if (this.knowledgeLoader.db) {
        try {
          // Query for a few sample entries to show what's in the knowledge base
          sampleEntries = await this.knowledgeLoader.query("", 5);
        } catch (error) {
          console.warn('Could not retrieve sample knowledge entries:', error);
        }
      }

      return {
        loadedFiles: loadedFiles,
        fileCount: loadedFiles.length,
        sampleEntries: sampleEntries.slice(0, 3), // Show first 3 entries
        totalEntries: sampleEntries.length
      };
    } catch (error) {
      console.warn('Error getting knowledge details:', error);
      return {
        loadedFiles: [],
        fileCount: 0,
        sampleEntries: [],
        totalEntries: 0
      };
    }
  }

  on(event, callback) {
    this.addEventListener(event, callback);
  }

  off(event, callback) {
    this.removeEventListener(event, callback);
  }
}