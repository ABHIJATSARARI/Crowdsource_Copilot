const { GoogleGenAI } = require('@google/genai');
const { OpenAI } = require('openai');
require('dotenv').config();

// Get environment variables - ONLY from .env file, never from request parameters
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize the appropriate AI provider based on configuration
let genAI, openaiClient;

// Status tracking
let aiStatusInfo = {
  provider: AI_PROVIDER,
  initialized: false,
  lastError: null,
  lastChecked: null,
  isHealthy: false
};

function initializeAIProviders() {
  try {
    if (AI_PROVIDER === 'gemini') {
      if (!GEMINI_API_KEY) {
        console.warn('No API key provided for Gemini in environment variables. AI features may not work correctly.');
        aiStatusInfo.lastError = 'Missing Gemini API key in environment';
        aiStatusInfo.initialized = false;
        aiStatusInfo.isHealthy = false;
        return;
      }
      genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      console.log('Initialized Gemini AI provider');
      aiStatusInfo.initialized = true;
    } else if (AI_PROVIDER === 'openai') {
      if (!OPENAI_API_KEY) {
        console.warn('No API key provided for OpenAI in environment variables. AI features may not work correctly.');
        aiStatusInfo.lastError = 'Missing OpenAI API key in environment';
        aiStatusInfo.initialized = false;
        aiStatusInfo.isHealthy = false;
        return;
      }
      openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
      console.log('Initialized OpenAI provider');
      aiStatusInfo.initialized = true;
    } else {
      console.warn(`Unknown AI provider: ${AI_PROVIDER}. Defaulting to Gemini.`);
      if (GEMINI_API_KEY) {
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        aiStatusInfo.initialized = true;
        aiStatusInfo.provider = 'gemini';
      } else {
        aiStatusInfo.initialized = false;
        aiStatusInfo.lastError = 'Missing API key in environment and unknown provider';
        aiStatusInfo.isHealthy = false;
      }
    }
  } catch (error) {
    console.error('Error initializing AI provider:', error);
    aiStatusInfo.lastError = error.message;
    aiStatusInfo.initialized = false;
    aiStatusInfo.isHealthy = false;
  }
}

// Initialize on service load
initializeAIProviders();

/**
 * AI Service for generating responses using various AI providers
 */
const aiService = {
  /**
   * Get the configured AI provider
   * @returns {string} The current AI provider name
   */
  getProvider: () => AI_PROVIDER,

  /**
   * Check health status of the AI service
   * @returns {Promise<Object>} Health status info
   */
  checkHealth: async () => {
    try {
      aiStatusInfo.lastChecked = new Date().toISOString();

      // Test that the AI provider can actually generate content
      if (AI_PROVIDER === 'gemini' && genAI) {
        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: "Test connection. Reply with OK."
        });
        aiStatusInfo.isHealthy = true;
        aiStatusInfo.lastError = null;
      } else if (AI_PROVIDER === 'openai' && openaiClient) {
        const response = await openaiClient.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [{ role: 'user', content: 'Test connection. Reply with OK.' }],
          max_tokens: 5
        });
        aiStatusInfo.isHealthy = true;
        aiStatusInfo.lastError = null;
      } else {
        aiStatusInfo.isHealthy = false;
        aiStatusInfo.lastError = 'AI provider not properly initialized';
      }
    } catch (error) {
      console.error('Health check failed:', error);
      aiStatusInfo.isHealthy = false;
      aiStatusInfo.lastError = error.message;
    }
    
    return {
      provider: aiStatusInfo.provider,
      initialized: aiStatusInfo.initialized,
      isHealthy: aiStatusInfo.isHealthy,
      lastError: aiStatusInfo.lastError,
      lastChecked: aiStatusInfo.lastChecked
    };
  },

  /**
   * Generate a response using the configured AI provider
   * @param {string} prompt - The prompt to send to the model
   * @param {Object} context - Optional context to help generate better responses
   * @returns {Promise<string>} The generated text response
   */
  generateResponse: async (prompt, context = {}) => {
    try {
      // If not initialized, try to reinitialize
      if (!aiStatusInfo.initialized) {
        initializeAIProviders();
        if (!aiStatusInfo.initialized) {
          throw new Error(`AI provider ${AI_PROVIDER} is not properly initialized. Check your .env file for API keys.`);
        }
      }

      // Add context to the prompt if available
      let enhancedPrompt = prompt;
      if (context && Object.keys(context).length > 0) {
        const contextString = Object.entries(context)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        enhancedPrompt = `Context:\n${contextString}\n\nPrompt:\n${prompt}`;
      }
      
      // Generate response based on the configured provider
      if (AI_PROVIDER === 'openai' && openaiClient) {
        return await aiService.generateOpenAIResponse(enhancedPrompt);
      } else {
        // Default to Gemini
        return await aiService.generateGeminiResponse(enhancedPrompt);
      }
    } catch (error) {
      console.error(`Error generating response from ${AI_PROVIDER}:`, error);
      aiStatusInfo.lastError = error.message;
      aiStatusInfo.isHealthy = false;
      throw new Error('Failed to generate AI response');
    }
  },

  /**
   * Generate a response using Gemini
   * @param {string} prompt - The prompt to send to the model
   * @returns {Promise<string>} The generated text response
   * @private
   */
  generateGeminiResponse: async (prompt) => {
    try {
      if (!genAI) {
        if (!GEMINI_API_KEY) {
          throw new Error('Missing Gemini API key in environment variables');
        }
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      }
      
      // Get the Gemini model
      const model = genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });
      
      // Return the result text
      const response = await model;
      return response.text;
    } catch (error) {
      console.error('Error generating response from Gemini:', error);
      throw new Error(`Failed to generate Gemini response: ${error.message}`);
    }
  },

  /**
   * Generate a response using OpenAI
   * @param {string} prompt - The prompt to send to the model
   * @returns {Promise<string>} The generated text response
   * @private
   */
  generateOpenAIResponse: async (prompt) => {
    try {
      if (!openaiClient) {
        if (!OPENAI_API_KEY) {
          throw new Error('Missing OpenAI API key in environment variables');
        }
        openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
      }
      
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1024
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response from OpenAI:', error);
      throw new Error('Failed to generate OpenAI response');
    }
  },
  
  /**
   * Generate a chat response based on the configured AI provider
   * @param {string} systemPrompt - The system prompt that sets the context
   * @param {string} userQuery - The user query or question
   * @param {Object} context - Additional context data
   * @returns {Promise<string>} The generated chat response
   */
  generateChatResponse: async (systemPrompt, userQuery, context = {}) => {
    try {
      // Add context to the query if available
      let enhancedQuery = userQuery;
      if (context && Object.keys(context).length > 0) {
        const relevantContext = { ...context };
        // Remove step from context since it's already in the system prompt
        delete relevantContext.step;
        
        if (Object.keys(relevantContext).length > 0) {
          const contextString = JSON.stringify(relevantContext, null, 2);
          enhancedQuery = `My current data:\n${contextString}\n\nMy question: ${userQuery}`;
        }
      }
      
      // Generate response based on the configured provider
      if (AI_PROVIDER === 'openai' && openaiClient) {
        return await aiService.generateOpenAIChatResponse(systemPrompt, enhancedQuery);
      } else {
        // Default to Gemini
        return await aiService.generateGeminiChatResponse(systemPrompt, enhancedQuery);
      }
    } catch (error) {
      console.error(`Error generating chat response from ${AI_PROVIDER}:`, error);
      throw new Error('Failed to generate AI chat response');
    }
  },

  /**
   * Generate a chat response using Gemini
   * @param {string} systemPrompt - The system prompt that sets the context
   * @param {string} userQuery - The user query or question
   * @returns {Promise<string>} The generated chat response
   * @private
   */
  generateGeminiChatResponse: async (systemPrompt, userQuery) => {
    try {
      if (!genAI) {
        if (!GEMINI_API_KEY) {
          throw new Error('Missing Gemini API key in environment variables');
        }
        genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      }
      
      // Use the Gemini models.generateContent method with appropriate config
      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "I understand the context and am ready to assist." }] },
          { role: "user", parts: [{ text: userQuery }] }
        ],
        config: {
          systemInstruction: "You are an innovation challenge assistant. Respond professionally and helpfully.",
          temperature: 0.7,
          maxOutputTokens: 1024,
          topK: 40,
          topP: 0.95,
        }
      });
      
      return response.text;
    } catch (error) {
      console.error('Error generating chat response from Gemini:', error);
      throw new Error('Failed to generate Gemini chat response');
    }
  },

  /**
   * Generate a chat response using OpenAI
   * @param {string} systemPrompt - The system prompt that sets the context
   * @param {string} userQuery - The user query or question
   * @returns {Promise<string>} The generated chat response
   * @private
   */
  generateOpenAIChatResponse: async (systemPrompt, userQuery) => {
    try {
      if (!openaiClient) {
        if (!OPENAI_API_KEY) {
          throw new Error('Missing OpenAI API key in environment variables');
        }
        openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
      }
      
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 1024
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response from OpenAI:', error);
      throw new Error('Failed to generate OpenAI chat response');
    }
  },
  
  /**
   * Generate tags for a challenge based on its description
   * @param {string} description - The challenge description
   * @param {string} type - The challenge type
   * @returns {Promise<string[]>} Array of generated tags
   */
  generateTags: async (description, type) => {
    try {
      const prompt = `
        Generate relevant tags or keywords for an innovation challenge based on this description:
        
        Challenge Type: ${type}
        Description: ${description}
        
        Provide 5-7 specific, relevant tags as a JSON array of strings. Each tag should be 1-3 words.
        Example format: ["artificial intelligence", "healthcare", "data analysis"]
      `;
      
      const response = await aiService.generateResponse(prompt);
      
      // Extract JSON array from response
      const match = response.match(/\[.*?\]/s);
      if (!match) {
        return [];
      }
      
      try {
        const tags = JSON.parse(match[0]);
        return Array.isArray(tags) ? tags : [];
      } catch (parseError) {
        console.error('Error parsing tags JSON:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error generating tags:', error);
      return [];
    }
  }
};

module.exports = aiService;