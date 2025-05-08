export const environment = {
  production: true,
  environment: 'production',
  apiUrl: '/api', // Production API URL uses relative path for deployment simplicity
  aiProvider: 'gemini', // Synced with backend AI_PROVIDER
  aiFeatures: {
    enabled: true,
    modelName: 'gemini-pro',
    providers: {
      gemini: {
        model: 'gemini-pro',
        maxTokens: 1024
      },
      openai: {
        model: 'gpt-4-turbo',
        maxTokens: 1024
      }
    }
  },
  defaultTimelineSettings: {
    minimumDuration: 14, // days
    recommendedDuration: 30, // days
    maximumDuration: 90, // days
    defaultMilestones: [
      { name: 'Registration Opens', dayOffset: 0, required: true },
      { name: 'Submission Deadline', dayOffset: -7, fromEnd: true, required: true },
      { name: 'Judging Period', dayOffset: -5, fromEnd: true, required: true },
      { name: 'Winners Announced', dayOffset: 0, fromEnd: true, required: true }
    ]
  }
};