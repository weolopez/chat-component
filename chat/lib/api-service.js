export class ApiService {
  constructor(config = {}) {
    this.selectedModel = config.model || 'gpt-4o-mini';
    this.apiKey = null;
    // this.resumeData = null;
    this.knowledgeBase = {};
    // this.knowledgeFiles = [
    //   './chat/knowledge/website.md',
    //   './chat/knowledge/chat-component.md',
    //   './chat/knowledge/projects.md'
    // ];
    this.useWebLLM = config.useWebLLM || false;
    this.webLLMEngine = config.engine || null;
    this.initialize();
  }
  modesData = {
            "customModes": [
                {
                    "slug": "mauricio_resume",
                    "name": "📄 Mauricio's Resume",
                    "icon": "📄",
                    "roleDefinition": "Get answers and explanations",
                    "groups": [ ["general", {"files": ["resume.json"]}]],
                    "customInstructions": `You are a helpful, friendly AI assistant. Provide concise and accurate responses.
                      When answering questions, incorporate relevant details from the resume and knowledge base when appropriate.
                      If asked about technical skills, work history, or professional experience, provide accurate information from the resume.
                      If asked about the website, how it was built, or about other projects, use information from the knowledge base.
                      Do not share personal contact information like address, email, or phone number unless explicitly requested by the user.
                      For questions outside of the provided context, respond as a helpful and friendly assistant.
                      Provide concise and accurate responses.

                      First-time users should know they can ask questions like:
                      - "What experience do you have with cloud architecture?"
                      - "Tell me about your technical skills"
                      - "What was your role at AT&T?"
                      - "What patents do you hold?"
                      - "How did you build this website?"
                      - "Tell me about your chat component implementation"
                      - "What other projects have you worked on?"
                      - "What technologies have you used in your projects?"
                    `
                },
                {
                    "slug": "application_architect",
                    "name": "🏗️ Application Architect",
                    "icon": "🏗️",
                    "backgroundColor": "darkblue",
                    "roleDefinition": "Plan and design before implementation",
                    "groups": ["read", ["edit", {"fileRegex": "\\.md$", "description": "Markdown files only"}], "browser", "command"],
                    "customInstructions": "Focus on planning, designing, and strategizing. When working on architectural tasks:\n\n1. **Problem Decomposition**: Break down complex problems into manageable components.\n2. **System Design**: Design high-level and detailed system architectures.\n3. **Technology Selection**: Evaluate and recommend appropriate technologies and frameworks.\n4. **Scalability & Performance**: Design for future growth and optimal performance.\n5. **Security**: Incorporate security best practices into the design.\n6. **Reliability & Resilience**: Ensure systems are robust and fault-tolerant.\n7. **Documentation**: Create clear and comprehensive architectural documentation.\n8. **Risk Assessment**: Identify potential risks and propose mitigation strategies.\n9. **Collaboration**: Work with development teams to ensure designs are implementable.\n10. **Standards**: Adhere to industry standards and best practices."
                },
                {
                    "slug": "architect",
                    "name": "🏗️ Architect",
                    "icon": "🏗️",
                    "roleDefinition": "Plan and design before implementation",
                    "groups": ["read", ["edit", {"fileRegex": "\\.md$", "description": "Markdown files only"}], "browser", "command"],
                    "customInstructions": "Focus on planning, designing, and strategizing. When working on architectural tasks:\n\n1. **Problem Decomposition**: Break down complex problems into manageable components.\n2. **System Design**: Design high-level and detailed system architectures.\n3. **Technology Selection**: Evaluate and recommend appropriate technologies and frameworks.\n4. **Scalability & Performance**: Design for future growth and optimal performance.\n5. **Security**: Incorporate security best practices into the design.\n6. **Reliability & Resilience**: Ensure systems are robust and fault-tolerant.\n7. **Documentation**: Create clear and comprehensive architectural documentation.\n8. **Risk Assessment**: Identify potential risks and propose mitigation strategies.\n9. **Collaboration**: Work with development teams to ensure designs are implementable.\n10. **Standards**: Adhere to industry standards and best practices."
                },
                {
                    "slug": "ask",
                    "name": "❓ Ask",
                    "icon": "❓",
                    "roleDefinition": "Get answers and explanations",
                    "groups": [ ["general", {"files": ["resume.json"]}]],
                    "customInstructions": "Focus on answering questions and providing information. When responding to queries:\n\n1. **Understand Query**: Fully grasp the user's question and underlying intent.\n2. **Information Retrieval**: Access relevant knowledge bases, documentation, or code.\n3. **Contextualize**: Provide answers that are relevant to the current context.\n4. **Clarity & Conciseness**: Explain complex topics clearly and concisely.\n5. **Accuracy**: Ensure all information provided is accurate and up-to-date.\n6. **Examples**: Use code snippets or diagrams to illustrate concepts where helpful.\n7. **Completeness**: Provide comprehensive answers that address all aspects of the query.\n8. **Guidance**: Offer next steps or related information if appropriate.\n9. **Neutrality**: Present information objectively without bias.\n10. **Learning**: Continuously learn and update knowledge based on new information."
                },
                {
                    "slug": "debug",
                    "name": "🪲 Debug",
                    "icon": "🪲",
                    "roleDefinition": "Diagnose and fix software issues",
                    "groups": ["read", "edit", "browser", "command"],
                    "customInstructions": "Focus on troubleshooting and diagnosing issues. When debugging:\n\n1. **Reproduce Issue**: Consistently reproduce the bug to understand its behavior.\n2. **Isolate Problem**: Narrow down the scope to identify the problematic component or code section.\n3. **Gather Information**: Collect logs, error messages, and system state.\n4. **Formulate Hypothesis**: Propose potential causes for the bug.\n5. **Test Hypothesis**: Use debugging tools, print statements, or temporary code changes to validate.\n6. **Identify Root Cause**: Pinpoint the exact reason for the bug.\n7. **Develop Fix**: Implement a solution that addresses the root cause.\n8. **Test Fix**: Verify that the fix resolves the issue without introducing new ones.\n9. **Regression Test**: Ensure existing functionality is not broken.\n10. **Document**: Record the bug, its cause, and the solution for future reference."
                },
                {
                    "slug": "orchestrator",
                    "name": "🪃 Orchestrator",
                    "roleDefinition": "Coordinate tasks across multiple modes",
                    "groups": ["read", "edit", "browser", "command", "new_task"],
                    "customInstructions": "Focus on breaking down and coordinating complex tasks. When orchestrating:\n\n1. **Task Definition**: Clearly define the overall goal and break it into subtasks.\n2. **Mode Selection**: Determine the most appropriate mode for each subtask.\n3. **Dependency Mapping**: Identify dependencies between subtasks.\n4. **Progress Tracking**: Monitor the progress of each subtask.\n5. **Resource Allocation**: Ensure necessary resources are available for each task.\n6. **Communication**: Facilitate communication between different modes or agents.\n7. **Problem Solving**: Address roadblocks or issues that arise during execution.\n8. **Integration**: Ensure seamless integration of outputs from different subtasks.\n9. **Review**: Periodically review the overall progress and adjust the plan as needed.\n10. **Completion**: Consolidate results and ensure the overall task is successfully completed."
                },
                {
                    "slug": "uidesigner",
                    "name": "🎨 UI Designer",
                    "roleDefinition": "You are a UI/UX design expert",
                    "groups": ["read", "edit", "browser", "command", "new_task"],
                    "customInstructions": "Focus on design strategy, user experience, and visual design. When working on UI projects:\n\n1. **Design Strategy**: Always start by understanding user needs, business goals, and technical constraints\n2. **Design Systems**: Create and maintain consistent design systems with reusable components\n3. **Accessibility**: Ensure designs meet WCAG 2.1 AA standards and are inclusive\n4. **Documentation**: Create comprehensive design documentation including style guides, component specifications, and user flows\n5. **Collaboration**: Work closely with developers to ensure designs are feasible and properly implemented\n6. **Testing**: Plan for usability testing and iterate based on user feedback\n7. **Standards**: Follow modern design principles including mobile-first approach, progressive enhancement, and performance considerations\n\nAvoid writing production code - focus on design specifications, mockups, prototypes, and design system documentation."
                },
                {
                    "slug": "uideveloper",
                    "name": "💻 UI Developer",
                    "icon": "💻",
                    "roleDefinition": "You are a frontend UI developer expert",
                    "groups": [
                        "read",
                        ["edit", {
                            "fileRegex": "\\.(js|jsx|ts|tsx|vue|svelte|html|css|scss|sass|less|json|yaml|yml|md|svg|png|jpg|jpeg|gif|webp)$",
                            "description": "Frontend development files, styles, components, and assets"
                        }],
                        "browser",
                        "command",
                        "mcp"
                    ],
                },
            ]
        };

  // Retrieve API key from localStorage or prompt user
  getApiKey() {
    let key = localStorage.getItem('openai_api_key');
    if (!key) {
      key = prompt('Please enter your OpenAI API key:');
      if (key) {
        localStorage.setItem('openai_api_key', key);
      } else {
        // redirect the page to /wc/google-login.html
        // const currentUrl = encodeURIComponent(window.location.pathname);
        // window.location.href = `/wc/google-login.html?returnUrl=${currentUrl}`;
        //throw new Error('API key not found in local storage');
      }
    }
    this.apiKey = key;
    return key;
  }

  // Initialize service: load API key, resume data, knowledge base
  async initialize() {
    this.getApiKey();
    // await this.fetchResumeData();
    // await this.loadKnowledgeBase();
  }

 
  // Streaming chat completion function
  async* streamChatCompletion(messages, options = {}) {
    if (this.useWebLLM) {
      // Use WebLLM engine
      if (!this.webLLMEngine) {
        throw new Error('WebLLM engine not provided');
      }
      
      try {
        const chunks = await this.webLLMEngine.chat.completions.create({
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1024,
          stream: true,
        });
        
        for await (const chunk of chunks) {
          yield chunk;
        }
      } catch (error) {
        console.error('Error in WebLLM streaming chat completion:', error);
        throw error;
      }
    } else if (this.apiKey.length > 5) {
      const url = 'https://api.openai.com/v1/chat/completions';

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      const data = {
        model: options.model || this.selectedModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1024,
        stream: true
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                  yield parsed;
                }
              } catch (e) {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in streaming chat completion:', error);
        throw error;
      }
    } else {
      const url = '/architect/completions';

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      const data = {
        model: options.model || this.selectedModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1024,
        stream: true
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                // if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                  yield parsed;
                // }
              } catch (e) {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in streaming chat completion:', error);
        throw error;
      }
    }
  }

  _mode_slug = 'ask'
  setMode(mode) {
    this._mode_slug = mode;
  }
  getMode() {
    return this.modesData.customModes.find(m => m.slug === this._mode_slug) || this.modesData.customModes[0];
  }

  // Create a system prompt that includes the resume data context and knowledge base
  createSystemPrompt() {
    let prompt = 'You are a helpful, friendly AI assistant. Answer questions clearly, concisely, and accurately. If you do not know the answer, say so honestly. Always be polite and provide useful information.';
    let mode = this.getMode();
    if (mode && mode.customInstructions) {
      prompt = `\n\n${mode.customInstructions}`;
    } 
    return prompt;
  }
}
