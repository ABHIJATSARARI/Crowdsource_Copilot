# CrowdsourceCopilot

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Project Overview

Crowdsource Copilot is an AI-assisted onboarding tool that guides users through the process of launching innovation challenges. The application has two main components:

- **Frontend**: An Angular-based web application
- **Backend**: An Express.js API server that provides AI functionality

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later)
- [Angular CLI](https://angular.io/cli) (v19.x)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd /path/to/Crowd/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root directory with the following environment variables:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_KEY=your_google_api_key
   CORS_ORIGIN=http://localhost:4200
   ```
   
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd /path/to/Crowd/frontend/crowdsource-copilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or modify `src/environments/environment.ts` with the backend API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

4. For production settings, update `src/environments/environment.prod.ts` as well.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

For a production build, use:
```bash
ng build --configuration production
```

## Deployment

### Deploy to a Static Hosting Service

To deploy the frontend to a static hosting service (like Firebase, Netlify, or Vercel):

1. Build the production version of the application:
   ```bash
   ng build --configuration production
   ```

2. Deploy the contents of the `dist/crowdsource-copilot` directory to your hosting provider.

   For example, using Firebase:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

### Deploy the Backend

1. For production deployment, ensure you have set up the necessary environment variables on your hosting platform.

2. Deploy the backend to a Node.js hosting service like Heroku, Digital Ocean, AWS, or GCP:

   For example, using Heroku:
   ```bash
   heroku create
   git subtree push --prefix backend heroku main
   ```

3. Update the frontend production environment to point to the deployed backend URL.

### Docker Deployment

You can also deploy both frontend and backend using Docker:

1. Create a `Dockerfile` in both frontend and backend directories.

2. Build and run the Docker images:
   ```bash
   # Build backend image
   cd backend
   docker build -t crowdsource-copilot-backend .
   
   # Build frontend image
   cd ../frontend/crowdsource-copilot
   docker build -t crowdsource-copilot-frontend .
   
   # Run containers
   docker run -p 3000:3000 crowdsource-copilot-backend
   docker run -p 4200:80 crowdsource-copilot-frontend
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running and the API URL in the environment files is correct.

2. **API Key Issues**: If you see AI service health warnings, check that your API keys are properly set in the backend `.env` file.

3. **CORS Errors**: Make sure the `CORS_ORIGIN` in the backend `.env` file matches your frontend URL.

### Support

If you encounter any issues or have questions, please open an issue in the project repository.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

For backend API documentation, see the API documentation at `http://localhost:3000/api-docs` when the backend server is running.
