# Crowdsource Copilot

## Project Overview

Crowdsource Copilot is an AI-assisted onboarding tool that guides users through the process of launching innovation challenges. The application simplifies the journey from idea conception to execution by providing a structured workflow and intelligent recommendations at every step.

The platform enables organizations to create, manage, and monitor innovation challenges effectively by leveraging best practices from popular crowdsourcing platforms like Topcoder, Wazoku, Kaggle, and HeroX.

![Crowdsource Copilot Dashboard](/frontend/crowdsource-copilot/public/logo.png)

## Features

- **Guided Challenge Creation**: Step-by-step wizard for defining challenges
- **AI Assistance**: Intelligent recommendations and content improvements
- **Audience Targeting**: Tools for defining participation criteria
- **Submission Management**: Configure submission requirements and formats
- **Prize Structure**: Design and manage prize allocations with AI recommendations
- **Timeline Planning**: Set milestones and deadlines with conflict detection
- **Evaluation Setup**: Define judging criteria and review processes
- **Challenge Monitoring**: Track engagement and manage communications

## Project Structure

```
/
├── backend/                  # Express.js API server
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middleware
│   ├── models/               # Data models
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic services
│   ├── package.json          # Backend dependencies
│   ├── README.md             # Backend documentation
│   └── server.js             # Server entry point
│
└── frontend/                 # Angular frontend application
    └── crowdsource-copilot/  # Angular project root
        ├── public/           # Static assets
        ├── src/              # Source code
        │   ├── app/          # Angular components and modules
        │   │   ├── core/     # Core services
        │   │   ├── features/ # Feature components
        │   │   ├── shared/   # Shared components and utilities
        │   │   └── state/    # NgRx state management
        │   ├── assets/       # Images and static files
        │   └── environments/ # Environment configurations
        ├── angular.json      # Angular CLI configuration
        ├── package.json      # Frontend dependencies
        └── README.md         # Frontend documentation
```

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **AI Integration**: Google Gemini and OpenAI

### Frontend
- **Angular**: Web application framework (v19)
- **Angular Material**: UI component library
- **NgRx**: State management
- **RxJS**: Reactive programming

## Getting Started

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- Angular CLI (v19.x)
- API keys for AI services (Google Gemini and/or OpenAI)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Crowd
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit the `.env` file with your API keys and configuration.

3. Set up the frontend:
   ```
   cd ../frontend/crowdsource-copilot
   npm install
   cp .env.example .env
   ```
   Edit the `.env` file with your frontend configuration.

4. Start both services:
   * In the backend directory: `npm run dev`
   * In the frontend directory: `ng serve`

5. Access the application at `http://localhost:4200`

For detailed setup instructions, refer to the README files in the frontend and backend directories.

## GitHub Setup

If you're setting up this project on GitHub:

1. Create a new GitHub repository

2. Initialize the local repository and push to GitHub:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. Environment Variables:
   - Never commit `.env` files with real credentials
   - Use the provided `.env.example` files as templates
   - For deployment, set up environment variables in your CI/CD pipeline or hosting platform

4. Large Files:
   - Large media files and archives are excluded via `.gitignore`
   - For large assets, consider using Git LFS or external storage solutions

## Documentation

The project includes the following documentation:

- [User Guide](./docs/USER_GUIDE.md): Instructions for using the application
- [Backend README](/backend/README.md): Backend setup and API documentation
- [Frontend README](/frontend/crowdsource-copilot/README.md): Frontend setup and development guide
- [Cost Coverage Report](./docs/COST_REPORT.md): Operational cost estimates
- [AI Models Reference](./docs/AI_MODELS.md): Information about AI models used

## Deployment

The application can be deployed using various methods:

- **Traditional Hosting**: Deploy the backend to a Node.js host and the frontend to a static host
- **Docker**: Containerize both frontend and backend
- **Cloud Platforms**: Deploy to AWS, Google Cloud, Azure, or similar platforms

See the README files in the frontend and backend directories for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Project Team (2025)