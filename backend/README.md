# Crowdsource Copilot - Backend API

This is the backend API service for the Crowdsource Copilot application, an AI-assisted onboarding tool for innovation challenges. The backend provides AI-powered functionality to support the platform's features, including content generation, recommendations, and chat assistance.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Providers**:
  - Google Gemini AI
  - OpenAI (GPT-4 Turbo)
- **Key Dependencies**:
  - Express: Web server framework
  - @google/genai: Google Gemini AI integration
  - OpenAI: OpenAI API integration
  - dotenv: Environment variable management
  - cors: Cross-Origin Resource Sharing support
  - body-parser: Request body parsing

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later recommended)
- [npm](https://www.npmjs.com/) (v8.x or later)
- API keys for at least one of the following AI providers:
  - [Google AI Studio](https://makersuite.google.com/) for Gemini models
  - [OpenAI](https://platform.openai.com/) for GPT models

## Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Crowd/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following environment variables:
   ```
   PORT=3000
   AI_PROVIDER=gemini  # or 'openai'
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   CORS_ORIGIN=http://localhost:4200
   NODE_ENV=development
   ```

   You need at least one of the API keys (GEMINI_API_KEY or OPENAI_API_KEY) depending on which AI_PROVIDER you configure.

## Running the Server

### Development Mode

To run the server in development mode with auto-reload:

```bash
npm run dev
```

### Production Mode

To run the server in production mode:

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Health Check Endpoints

- **GET /health** or **GET /api/health**
  - Check the health status of the API and AI services
  - Returns: Server status and AI provider health information

### AI Service Endpoints

All AI endpoints are prefixed with `/api/ai`.

- **GET /api/ai/health**
  - Check the health status of the AI service
  - Returns: AI provider health information

- **POST /api/ai/generate**
  - Generate content using the configured AI provider
  - Body: `{ "prompt": "Your prompt text", "context": { optional context object } }`
  - Returns: Generated text response

- **POST /api/ai/generate-stream**
  - Generate streaming AI content
  - Body: `{ "prompt": "Your prompt text" }`
  - Returns: Server-sent events with generated content chunks

- **POST /api/ai/recommend**
  - Get AI recommendations based on prompt
  - Body: `{ "prompt": "Your prompt", "type": "recommendation_type" }`
  - Returns: Recommendations as structured JSON

- **POST /api/ai/improve-text**
  - Improve text using AI
  - Body: `{ "text": "Your text", "instructions": "Optional improvement instructions" }`
  - Returns: Improved text

- **POST /api/ai/explain**
  - Get AI explanation for a concept
  - Body: `{ "concept": "Concept to explain", "level": "beginner|intermediate|advanced" }`
  - Returns: Explanation text

- **POST /api/ai/assist**
  - Get personalized assistance
  - Body: `{ "query": "User question", "context": { user context object } }`
  - Returns: Assistance response

- **POST /api/ai/chat/create**
  - Create a new chat session
  - Body: `{ "systemPrompt": "Initial context" }`
  - Returns: Chat session ID

- **POST /api/ai/chat/send**
  - Send a message in an existing chat session
  - Body: `{ "sessionId": "chat_session_id", "message": "User message" }`
  - Returns: AI response message

## Error Handling

The API uses standard HTTP status codes:
- 200: Successful request
- 400: Bad request (e.g., missing required parameters)
- 401: Unauthorized (e.g., invalid API key)
- 404: Resource not found
- 500: Internal server error

Errors are returned in a consistent format:
```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port number for the server | 5000 |
| AI_PROVIDER | AI provider to use ('gemini' or 'openai') | gemini |
| GEMINI_API_KEY | API key for Google Gemini AI | - |
| OPENAI_API_KEY | API key for OpenAI | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:4200 |
| NODE_ENV | Environment (development or production) | development |

## Development

### Project Structure

```
backend/
├── controllers/       # Request handlers
│   └── aiController.js
├── middleware/        # Express middleware
├── models/            # Data models
├── routes/            # API routes
│   └── aiRoutes.js
├── services/          # Business logic
│   └── aiService.js
├── .env               # Environment variables (not in repo)
├── package.json       # Project dependencies
├── README.md          # This file
└── server.js          # Main entry point
```

### Adding New Features

1. Define new routes in the appropriate route file (e.g., `routes/aiRoutes.js`)
2. Create controller methods in the related controller (e.g., `controllers/aiController.js`)
3. Implement business logic in the service layer (e.g., `services/aiService.js`)
4. Test your endpoints using a tool like Postman or curl

## Deployment

### Preparing for Production

1. Create a production `.env` file with appropriate settings:
   ```
   PORT=3000
   AI_PROVIDER=gemini  # or your preferred provider
   GEMINI_API_KEY=your_production_key
   OPENAI_API_KEY=your_production_key
   CORS_ORIGIN=https://your-frontend-domain.com
   NODE_ENV=production
   ```

2. Consider using a process manager for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name crowdsource-copilot-api
   ```

### Docker Deployment

1. Create a `Dockerfile` in the backend directory:
   ```Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run the Docker image:
   ```bash
   docker build -t crowdsource-copilot-api .
   docker run -p 3000:3000 --env-file .env crowdsource-copilot-api
   ```

### Cloud Deployment

The backend can be deployed to various cloud platforms:

#### Heroku
```bash
heroku create crowdsource-copilot-api
heroku config:set GEMINI_API_KEY=your_api_key
git push heroku main
```

#### Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/your-project/crowdsource-copilot-api
gcloud run deploy --image gcr.io/your-project/crowdsource-copilot-api
```

## Troubleshooting

### Common Issues

1. **AI Service Unhealthy**
   - Check that your API keys are correctly set in the .env file
   - Verify you have proper credentials and billing set up with the AI provider

2. **CORS Errors**
   - Ensure the CORS_ORIGIN in .env matches your frontend URL
   - For development, you may set CORS_ORIGIN=* (not recommended for production)

3. **Rate Limiting**
   - Both Gemini and OpenAI have rate limits
   - Implement caching or rate limiting in your application

### Logs

Check the logs for detailed error information:
- In development mode, errors are logged to the console
- In production, consider using a logging service

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request