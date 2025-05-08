const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * AI routes for recommendation, text improvement, explanations and assistance
 */

// GET /api/ai/health - Check AI service health status
router.get('/health', aiController.checkHealth);

// POST /api/ai/generate - Generate AI content (main endpoint used by front-end)
router.post('/generate', aiController.generate);

// POST /api/ai/generate-stream - Generate streaming AI content
router.post('/generate-stream', aiController.generateStream);

// POST /api/ai/recommend - Get AI recommendations based on prompt
router.post('/recommend', aiController.recommend);

// POST /api/ai/improve-text - Improve text using AI
router.post('/improve-text', aiController.improveText);

// POST /api/ai/explain - Get AI explanation for a concept
router.post('/explain', aiController.explainConcept);

// POST /api/ai/assist - Get personalized assistance
router.post('/assist', aiController.assist);

// POST /api/ai/chat/create - Create a new chat session
router.post('/chat/create', aiController.createChatSession);

// POST /api/ai/chat/send - Send a message in an existing chat session
router.post('/chat/send', aiController.sendChatMessage);

module.exports = router;