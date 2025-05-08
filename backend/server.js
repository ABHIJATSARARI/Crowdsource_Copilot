const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiService = require('./services/aiService');
require('dotenv').config();

// Import routes
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/ai', aiRoutes);

// Main health check endpoint - support both paths
app.get('/health', getHealthStatus);
app.get('/api/health', getHealthStatus); // Add this route to match frontend's expectation

// Health check function
async function getHealthStatus(req, res) {
  try {
    // Check AI service health
    const aiHealth = await aiService.checkHealth();
    
    // Return combined health status
    res.status(200).json({
      status: 'OK',
      message: 'Server is running',
      services: {
        server: {
          status: 'OK',
          uptime: process.uptime()
        },
        ai: aiHealth
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
}

// Basic route
app.get('/', (req, res) => {
  res.send('Innovation Challenge Copilot API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Check AI service health on startup
  try {
    const aiHealth = await aiService.checkHealth();
    console.log('AI Service Status:');
    console.log(`- Provider: ${aiHealth.provider}`);
    console.log(`- Health: ${aiHealth.isHealthy ? 'Healthy' : 'Unhealthy'}`);
    console.log(`- Initialized: ${aiHealth.initialized ? 'Yes' : 'No'}`);
    
    if (!aiHealth.isHealthy) {
      console.warn(`- Error: ${aiHealth.lastError || 'Unknown error'}`);
      console.warn('AI features may not work correctly.');
      console.warn('Set a valid API key using the /api/ai/update-key endpoint or in your environment variables.');
    }
  } catch (error) {
    console.error('Failed to check AI service health on startup:', error);
    console.warn('AI features may not work correctly.');
  }
});