const aiService = require('../services/aiService');

/**
 * Controller for handling AI-related endpoints
 */
const aiController = {
  /**
   * Check health status of AI services
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  checkHealth: async (req, res) => {
    try {
      const healthStatus = await aiService.checkHealth();
      res.json(healthStatus);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        isHealthy: false,
        error: error.message
      });
    }
  },

  /**
   * Generate content using AI (main endpoint for frontend)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  generate: async (req, res) => {
    try {
      const { prompt, context, options = {} } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      // Remove any API key if it was accidentally sent in options
      delete options.apiKey;
      
      const response = await aiService.generateResponse(prompt, context);
      
      res.json({ 
        text: response,
        success: true,
        usage: {
          promptTokens: 0,  // Actual token count not available easily with Gemini
          completionTokens: 0,
          totalTokens: 0
        }
      });
    } catch (error) {
      console.error('Error in content generation:', error);
      res.status(500).json({ 
        text: 'Failed to generate content: ' + error.message,
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Generate streaming content using AI chat sessions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  generateStream: async (req, res) => {
    try {
      const { prompt, context, options = {} } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      // Remove any API key if it was accidentally sent in options
      delete options.apiKey;
      
      // Set up SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      try {
        const stream = await aiService.generateGeminiStreamResponse(prompt);
        
        // Process the stream chunks and send them to the client
        for await (const chunk of stream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            // Flush to ensure data is sent immediately
            if (res.flush) {
              res.flush();
            }
          }
        }
        
        // End the stream
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (streamError) {
        console.error('Error in streaming content:', streamError);
        res.write(`data: ${JSON.stringify({ error: streamError.message })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error('Error setting up content streaming:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate streaming content' });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  },

  /**
   * Get recommendation based on a prompt
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  recommend: async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      
      const response = await aiService.generateResponse(prompt, context);
      res.json({ response });
    } catch (error) {
      console.error('Error in AI recommendation:', error);
      res.status(500).json({ error: 'Failed to generate recommendation' });
    }
  },
  
  /**
   * Improve text content using AI
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  improveText: async (req, res) => {
    try {
      const { text, type } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }
      
      const promptMap = {
        problem: 'Improve this problem statement while maintaining its core meaning. Make it clearer, more specific, and more engaging:',
        description: 'Enhance this description to make it more detailed, engaging, and professional:',
        criteria: 'Refine these evaluation criteria to make them more specific, measurable, and objective:',
        rules: 'Improve these rules to make them clearer, more comprehensive, and better structured:'
      };
      
      const promptPrefix = promptMap[type] || 'Improve this text while maintaining its core meaning:';
      const prompt = `${promptPrefix}\n\n${text}\n\nImproved version:`;
      
      const improvedText = await aiService.generateResponse(prompt);
      res.json({ improvedText });
    } catch (error) {
      console.error('Error in text improvement:', error);
      res.status(500).json({ error: 'Failed to improve text' });
    }
  },
  
  /**
   * Generate an explanation for a concept
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  explainConcept: async (req, res) => {
    try {
      const { topic, format } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }
      
      let promptPrefix = 'Provide a detailed explanation of this concept:';
      
      if (format === 'simple') {
        promptPrefix = 'Explain this concept in simple terms, as if to someone new to the field:';
      } else if (format === 'technical') {
        promptPrefix = 'Provide a technical, in-depth explanation of this concept for domain experts:';
      }
      
      const prompt = `${promptPrefix}\n\n${topic}\n\nExplanation:`;
      const explanation = await aiService.generateResponse(prompt);
      
      res.json({ explanation });
    } catch (error) {
      console.error('Error in concept explanation:', error);
      res.status(500).json({ error: 'Failed to generate explanation' });
    }
  },
  
  /**
   * Get personalized assistance based on user query and context
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  assist: async (req, res) => {
    try {
      const { query, context } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }
      
      // Create a context-aware prompt
      let contextDescription = '';
      if (context && context.step) {
        const stepMap = {
          step1: 'defining the challenge problem statement and goals',
          step2: 'setting audience and participation requirements',
          step3: 'defining submission requirements',
          step4: 'setting up prizes and incentives',
          step5: 'creating the challenge timeline and milestones',
          step6: 'establishing evaluation criteria',
          step7: 'setting up administration and communication'
        };
        
        contextDescription = stepMap[context.step] || 'creating an innovation challenge';
      }
      
      const systemPrompt = `
        You are an expert assistant for innovation challenge creators. 
        Your role is to provide helpful, accurate advice about creating and managing 
        successful crowdsourcing challenges.
        
        The user is currently ${contextDescription}.
        
        Provide a concise, helpful response to their question.
      `;
      
      const response = await aiService.generateChatResponse(systemPrompt, query, context);
      res.json({ response });
    } catch (error) {
      console.error('Error in assistant response:', error);
      res.status(500).json({ error: 'Failed to generate assistance response' });
    }
  },

  /**
   * Create a new chat session for multi-turn conversation
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createChatSession: async (req, res) => {
    try {
      // In a real implementation, you'd create and store a session
      // For now we'll just return a mock session ID
      const sessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      
      res.json({
        success: true,
        sessionId,
        message: 'Chat session created'
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create chat session' 
      });
    }
  },

  /**
   * Send a message in an existing chat session
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  sendChatMessage: async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
      }
      
      // In a real implementation, you'd retrieve the existing chat history
      // For now, we'll just process this as a single message
      const response = await aiService.generateResponse(message);
      
      res.json({
        success: true,
        sessionId,
        reply: response
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process chat message'
      });
    }
  }
};

module.exports = aiController;