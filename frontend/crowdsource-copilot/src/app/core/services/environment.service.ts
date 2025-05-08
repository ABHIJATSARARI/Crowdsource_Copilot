import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Service for providing environment-specific configuration
 * throughout the application
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private env: any;
  
  constructor() {
    this.env = environment;
    
    // Log environment-specific message for debugging
    if (!this.isProduction()) {
      console.log('Running in development mode');
    }
  }

  /**
   * Get the API URL for the backend
   * @returns The API base URL
   */
  get apiUrl(): string {
    return this.env.apiUrl;
  }

  /**
   * Get the AI provider currently in use
   * @returns The AI provider name
   */
  get aiProvider(): string {
    return this.env.aiProvider;
  }

  /**
   * Get the AI API key for external services
   * @returns The AI API key or null if not set
   */
  get aiApiKey(): string | null {
    return this.env.aiApiKey || null;
  }

  /**
   * Get the AI features configuration
   * @returns The AI features config object
   */
  get aiFeatures(): { enabled: boolean, modelName: string } {
    return this.env.aiFeatures || { enabled: false, modelName: 'gemini-pro' };
  }

  /**
   * Get the environment name
   * @returns The current environment name
   */
  get environment(): string {
    return this.env.environment;
  }

  /**
   * Check if the app is running in production mode
   * @returns True if in production mode
   */
  isProduction(): boolean {
    return this.env.production === true;
  }

  /**
   * Get a specific environment variable by key
   * @param key The environment variable key
   * @param defaultValue Optional default value if key doesn't exist
   * @returns The environment variable value
   */
  getValue(key: string, defaultValue?: any): any {
    return this.env[key] !== undefined ? this.env[key] : defaultValue;
  }
}