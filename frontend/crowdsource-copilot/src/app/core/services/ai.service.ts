import { Injectable } from '@angular/core';
import { Observable, of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap, retry, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { EnvironmentService } from './environment.service';

export interface AIResponse {
  text: string;
  success: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIRequest {
  prompt: string;
  context?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    topK?: number;
    topP?: number;
    model?: string;
  };
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export interface FunctionCallingRequest extends AIRequest {
  functions: FunctionDeclaration[];
  functionCallBehavior?: 'auto' | 'required' | 'none';
}

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface FunctionCallingResponse extends AIResponse {
  functionCall?: FunctionCall;
}

export interface SafetySettings {
  category: 'HARM_CATEGORY_HARASSMENT' | 
            'HARM_CATEGORY_HATE_SPEECH' | 
            'HARM_CATEGORY_SEXUALLY_EXPLICIT' | 
            'HARM_CATEGORY_DANGEROUS_CONTENT';
  threshold: 'BLOCK_NONE' | 
             'BLOCK_LOW_AND_ABOVE' | 
             'BLOCK_MED_AND_ABOVE' | 
             'BLOCK_HIGH_AND_ABOVE';
}

export enum GeminiModel {
  GEMINI_PRO = 'gemini-pro',
  GEMINI_PRO_VISION = 'gemini-pro-vision',
  GEMINI_ULTRA = 'gemini-ultra',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  GEMINI_1_5_PRO_LATEST = 'gemini-1.5-pro-latest',
  GEMINI_1_5_FLASH_LATEST = 'gemini-1.5-flash-latest',
  GEMINI_2_0_PRO = 'gemini-2.0-pro',
  GEMINI_2_0_FLASH = 'gemini-2.0-flash'
}

export interface GeminiFunctionDefinition {
  name: string;
  description?: string;
  parameters: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}

export interface GeminiFunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface StreamingAIRequest extends AIRequest {
  streamResponse: boolean;
}

export interface GeminiChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  imageData?: string; // Base64 image data for vision models
}

export interface GeminiChatRequest {
  messages: GeminiChatMessage[];
  options?: {
    temperature?: number;
    maxTokens?: number;
    topK?: number;
    topP?: number;
    model?: string;
  };
}

export interface MultiModalRequest {
  text: string;
  imageData: string; // Base64 encoded image data
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  };
}

export interface ChatSession {
  sessionId: string;
  messages: GeminiChatMessage[];
  model: string;
}

export interface AIHealthStatus {
  provider: string;
  initialized: boolean;
  isHealthy: boolean;
  lastError: string | null;
  lastChecked: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly aiEnabled: boolean;
  private readonly defaultModel: string;
  
  // Stream support
  private streamingSubject = new Subject<string>();
  public streaming$ = this.streamingSubject.asObservable();
  
  // AI status tracking
  private aiStatusSubject = new BehaviorSubject<'idle' | 'processing' | 'error'>('idle');
  public aiStatus$ = this.aiStatusSubject.asObservable();

  // AI health status
  private aiHealthSubject = new BehaviorSubject<AIHealthStatus | null>(null);
  public aiHealth$ = this.aiHealthSubject.asObservable();
  
  // Connection status
  private backendConnectedSubject = new BehaviorSubject<boolean | null>(null);
  public backendConnected$ = this.backendConnectedSubject.asObservable();

  // Chat sessions
  private activeSessions: Map<string, ChatSession> = new Map();
  
  constructor(
    private apiService: ApiService,
    private environmentService: EnvironmentService
  ) {
    this.aiEnabled = this.environmentService.aiFeatures?.enabled || false;
    this.defaultModel = this.environmentService.aiFeatures?.modelName || GeminiModel.GEMINI_2_0_FLASH;
    
    // Check backend connectivity and AI health on initialization
    this.checkBackendConnection();
  }

  /**
   * Check connection to the backend
   * @returns Observable with connection result
   */
  checkBackendConnection(): Observable<boolean> {
    return this.apiService.get('/health').pipe(
      map(() => {
        this.backendConnectedSubject.next(true);
        // After successful backend connection, check AI health
        this.checkAIHealth().subscribe();
        return true;
      }),
      catchError(error => {
        console.error('Backend connection check failed:', error);
        this.backendConnectedSubject.next(false);
        return of(false);
      })
    );
  }

  /**
   * Check the health status of the AI service
   * @returns Observable with AI health information
   */
  checkAIHealth(): Observable<AIHealthStatus> {
    if (!this.backendConnectedSubject.value) {
      return of({
        provider: 'unknown',
        initialized: false,
        isHealthy: false,
        lastError: 'Backend not connected',
        lastChecked: new Date().toISOString()
      });
    }

    return this.apiService.get<AIHealthStatus>('/ai/health').pipe(
      tap(health => {
        this.aiHealthSubject.next(health);
        
        // Log status to console for debugging
        console.log('AI Service Health Check:');
        console.log(`- Provider: ${health.provider}`);
        console.log(`- Status: ${health.isHealthy ? 'Healthy' : 'Unhealthy'}`);
        
        if (!health.isHealthy && health.lastError) {
          console.warn(`- Error: ${health.lastError}`);
        }
      }),
      catchError(error => {
        console.error('AI health check failed:', error);
        const status: AIHealthStatus = {
          provider: 'unknown',
          initialized: false,
          isHealthy: false,
          lastError: error.message || 'Unable to check AI health',
          lastChecked: new Date().toISOString()
        };
        this.aiHealthSubject.next(status);
        return of(status);
      })
    );
  }

  /**
   * Get AI assistance based on the provided prompt and context
   * @param request Object containing prompt, context and options
   * @returns Observable with AI-generated response
   */
  getAssistance(request: AIRequest): Observable<AIResponse> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of({
        text: 'AI assistance is currently unavailable.',
        success: false
      });
    }
    
    this.aiStatusSubject.next('processing');
    
    // Ensure we have a model specified, defaulting if not provided
    const options = {
      ...request.options,
      model: request.options?.model || this.defaultModel
    };

    return this.apiService.post<AIResponse>('/ai/generate', {...request, options}).pipe(
      tap(() => this.aiStatusSubject.next('idle')),
      map(response => ({
        ...response,
        success: true
      })),
      catchError(error => {
        console.error('Error getting AI assistance:', error);
        this.aiStatusSubject.next('error');
        
        // Update health status if we get an error
        this.checkAIHealth().subscribe();
        
        return of({
          text: `Sorry, I encountered an error while processing your request: ${error.error?.message || error.message || 'Unknown error'}. Please try again later.`,
          success: false
        });
      }),
      finalize(() => {
        // Ensure status is reset in case of errors
        if (this.aiStatusSubject.value === 'processing') {
          this.aiStatusSubject.next('idle');
        }
      })
    );
  }

  /**
   * Get AI assistance with streaming response
   * @param request Object containing prompt, context and options
   * @returns Observable that completes when streaming is done
   */
  getStreamingAssistance(request: StreamingAIRequest): Observable<boolean> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      this.streamingSubject.next('AI assistance is currently unavailable.');
      return of(false);
    }
    
    this.aiStatusSubject.next('processing');
    
    // Add streaming flag and ensure we have a model specified
    const options = {
      ...request.options,
      model: request.options?.model || this.defaultModel
    };

    return this.apiService.post<EventSource>('/ai/generate-stream', {...request, options}).pipe(
      switchMap(() => {
        return new Observable<boolean>(observer => {
          // Set up SSE connection
          const eventSource = new EventSource('/api/ai/generate-stream');
          
          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.text) {
                this.streamingSubject.next(data.text);
              }
              
              if (data.done) {
                eventSource.close();
                this.aiStatusSubject.next('idle');
                observer.next(true);
                observer.complete();
              }
              
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (error) {
              console.error('Error parsing streaming response:', error);
              this.aiStatusSubject.next('error');
              observer.error(error);
            }
          };
          
          eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
            this.aiStatusSubject.next('error');
            observer.error(new Error('Connection error in streaming response'));
          };
          
          return () => {
            eventSource.close();
          };
        });
      }),
      catchError(error => {
        console.error('Error with streaming AI request:', error);
        this.streamingSubject.next('Error: Connection to AI service failed. Please try again.');
        this.aiStatusSubject.next('error');
        return of(false);
      })
    );
  }
  
  /**
   * Create a new chat session
   * @returns Observable with session ID
   */
  createChatSession(): Observable<string> {
    return this.apiService.post<{success: boolean, sessionId: string}>('/ai/chat/create', {
      model: this.defaultModel
    }).pipe(
      map(response => {
        if (response.success && response.sessionId) {
          // Store the new session
          this.activeSessions.set(response.sessionId, {
            sessionId: response.sessionId,
            messages: [],
            model: this.defaultModel
          });
          return response.sessionId;
        } else {
          throw new Error('Failed to create chat session');
        }
      })
    );
  }
  
  /**
   * Send a message in an existing chat session
   * @param sessionId The ID of the chat session
   * @param message The message to send
   * @returns Observable with the response text
   */
  sendChatMessage(sessionId: string, message: string): Observable<string> {
    if (!this.activeSessions.has(sessionId)) {
      return throwError(() => new Error('Chat session not found'));
    }
    
    this.aiStatusSubject.next('processing');
    
    // Add the user message to our local session store
    const session = this.activeSessions.get(sessionId)!;
    session.messages.push({
      role: 'user',
      content: message
    });
    
    return this.apiService.post<{success: boolean, reply: string}>('/ai/chat/send', {
      sessionId,
      message
    }).pipe(
      tap(() => this.aiStatusSubject.next('idle')),
      map(response => {
        if (response.success && response.reply) {
          // Add the model's response to our local session store
          session.messages.push({
            role: 'model',
            content: response.reply
          });
          return response.reply;
        } else {
          throw new Error('Failed to get chat response');
        }
      }),
      catchError(error => {
        console.error('Error in chat message:', error);
        this.aiStatusSubject.next('error');
        return throwError(() => error);
      })
    );
  }

  /**
   * Use Gemini chat interface for more complex interactions
   * @param request Chat messages and options
   * @returns Observable with AI-generated response
   */
  getChatResponse(request: GeminiChatRequest): Observable<AIResponse> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of({
        text: 'AI assistance is currently unavailable.',
        success: false
      });
    }
    
    this.aiStatusSubject.next('processing');
    
    // Ensure we have a model specified, defaulting if not provided
    const options = {
      ...request.options,
      model: request.options?.model || this.defaultModel
    };

    // Convert the messages to the format expected by the backend
    const formattedMessages = request.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    return this.apiService.post<AIResponse>('/ai/chat', {
      messages: formattedMessages,
      options: options
    }).pipe(
      tap(() => this.aiStatusSubject.next('idle')),
      retry(1),
      map(response => ({
        ...response,
        success: true
      })),
      catchError(error => {
        console.error('Error getting chat response:', error);
        this.aiStatusSubject.next('error');
        return of({
          text: 'Sorry, I encountered an error while processing your request. Please try again later.',
          success: false
        });
      })
    );
  }

  /**
   * Process a multimodal request containing both text and image
   * @param request Object containing text prompt and image data
   * @returns Observable with AI-generated response
   */
  processMultiModalRequest(request: MultiModalRequest): Observable<AIResponse> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of({
        text: 'AI assistance is currently unavailable.',
        success: false
      });
    }
    
    this.aiStatusSubject.next('processing');
    
    // Default to vision model if not specified
    const options = {
      ...request.options,
      model: request.options?.model || GeminiModel.GEMINI_PRO_VISION
    };

    return this.apiService.post<AIResponse>('/ai/process-multimodal', {...request, options}).pipe(
      tap(() => this.aiStatusSubject.next('idle')),
      map(response => ({
        ...response,
        success: true
      })),
      catchError(error => {
        console.error('Error processing multimodal request:', error);
        this.aiStatusSubject.next('error');
        return of({
          text: 'Sorry, I encountered an error while processing your image and text. Please try again later.',
          success: false
        });
      })
    );
  }

  /**
   * Improve text using AI assistance
   * @param text The text to improve
   * @param type The type of text being improved (problem, goals, etc.)
   * @returns Observable with the improved text
   */
  improveText(text: string, type: string): Observable<string> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of(text);
    }

    this.aiStatusSubject.next('processing');

    const prompt = `Improve this ${type} statement to make it more clear, effective, and professional: "${text}"`;
    
    return this.getAssistance({
      prompt,
      options: { temperature: 0.4 }
    }).pipe(
      map(response => response.text),
      catchError(error => {
        console.error(`Error improving ${type} text:`, error);
        this.aiStatusSubject.next('error');
        return of(text);
      }),
      finalize(() => this.aiStatusSubject.next('idle'))
    );
  }

  /**
   * Get recommendations based on a specific prompt
   * @param prompt The prompt to get recommendations for
   * @returns Observable with the recommendation text
   */
  getRecommendation(prompt: string): Observable<string> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of('AI assistance is currently unavailable.');
    }

    this.aiStatusSubject.next('processing');
    
    return this.getAssistance({
      prompt,
      options: { temperature: 0.7 }
    }).pipe(
      map(response => response.text),
      catchError(error => {
        console.error('Error getting recommendation:', error);
        this.aiStatusSubject.next('error');
        return throwError(() => new Error('Failed to get recommendations'));
      }),
      finalize(() => this.aiStatusSubject.next('idle'))
    );
  }

  /**
   * Get timeline suggestions for a challenge
   * @param challengeDetails The challenge details to get timeline suggestions for
   * @returns Observable with the timeline suggestions
   */
  getTimelineSuggestions(challengeDetails: any): Observable<any> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of({
        phases: [],
        message: 'AI assistance is currently unavailable.'
      });
    }

    this.aiStatusSubject.next('processing');
    
    const prompt = `Based on the following innovation challenge details, suggest a realistic timeline with key phases and milestones:
      
      Title: ${challengeDetails.title}
      Problem: ${challengeDetails.problemStatement}
      Goals: ${challengeDetails.goals}
      Type: ${challengeDetails.type}
      
      Provide a structured response with recommended phases, each with a name, description, duration, and key deliverables.`;
    
    return this.getAssistance({
      prompt,
      options: { temperature: 0.4 }
    }).pipe(
      map(response => {
        // Try to extract structured content when possible
        try {
          // Basic parsing to extract timeline phases
          const text = response.text;
          const phases = [];
          const lines = text.split('\n');
          
          let currentPhase: any = null;
          
          for (const line of lines) {
            // Look for phase headers
            if (line.match(/phase\s*\d+|phase\s*:/i) || line.match(/^\d+\.\s*[A-Z]/)) {
              // Save previous phase if it exists
              if (currentPhase) {
                phases.push(currentPhase);
              }
              
              // Start new phase
              currentPhase = {
                name: line.replace(/^\d+\.\s*/, '').trim(),
                description: '',
                duration: '',
                deliverables: []
              };
            } else if (currentPhase) {
              // Add content to current phase
              if (line.match(/duration|timeline|period|weeks|days|months/i)) {
                currentPhase.duration = line.replace(/.*?:\s*/, '').trim();
              } else if (line.match(/deliverable|outcome|output|result/i)) {
                currentPhase.deliverables.push(line.replace(/.*?:\s*/, '').trim());
              } else if (line.trim()) {
                currentPhase.description += line.trim() + ' ';
              }
            }
          }
          
          // Add the last phase
          if (currentPhase) {
            phases.push(currentPhase);
          }
          
          return { phases, rawResponse: text };
        } catch (error) {
          console.error('Error parsing timeline response:', error);
          return {
            phases: [],
            rawResponse: response.text
          };
        }
      }),
      catchError(error => {
        console.error('Error getting timeline suggestions:', error);
        this.aiStatusSubject.next('error');
        return of({
          phases: [],
          message: 'Failed to get timeline suggestions. Please try again.'
        });
      }),
      finalize(() => this.aiStatusSubject.next('idle'))
    );
  }

  /**
   * Get evaluation criteria suggestions for a challenge
   * @param challengeDetails The challenge details to get evaluation criteria suggestions for
   * @returns Observable with the evaluation criteria suggestions
   */
  getEvaluationCriteriaSuggestions(challengeDetails: any): Observable<any> {
    if (!this.aiEnabled) {
      console.warn('AI features are disabled in the environment configuration');
      return of({
        criteria: [],
        message: 'AI assistance is currently unavailable.'
      });
    }

    this.aiStatusSubject.next('processing');
    
    const prompt = `Based on the following innovation challenge details, suggest evaluation criteria that would be appropriate for judging submissions:
      
      Title: ${challengeDetails.title}
      Problem: ${challengeDetails.problemStatement}
      Goals: ${challengeDetails.goals}
      Type: ${challengeDetails.type}
      
      Provide 4-6 evaluation criteria, each with a name, description, and weighting percentage. The percentages should add up to 100%.`;
    
    return this.getAssistance({
      prompt,
      options: { temperature: 0.4 }
    }).pipe(
      map(response => {
        // Try to extract structured content when possible
        try {
          const text = response.text;
          const criteria = [];
          const lines = text.split('\n');
          
          let currentCriterion: any = null;
          
          for (const line of lines) {
            // Look for criteria headers or numbered items
            if (line.match(/^\d+\.\s*[A-Z]/) || line.match(/criteria\s*\d+|criterion\s*\d+/i)) {
              // Save previous criterion if it exists
              if (currentCriterion) {
                criteria.push(currentCriterion);
              }
              
              // Start new criterion
              currentCriterion = {
                name: line.replace(/^\d+\.\s*/, '').trim(),
                description: '',
                weight: 0
              };
              
              // Try to extract weight from the header
              const weightMatch = line.match(/\((\d+)%\)/);
              if (weightMatch) {
                currentCriterion.weight = parseInt(weightMatch[1], 10);
              }
            } else if (currentCriterion) {
              // Add content to current criterion
              if (line.match(/weight|percentage|points/i)) {
                const weightMatch = line.match(/(\d+)%/);
                if (weightMatch) {
                  currentCriterion.weight = parseInt(weightMatch[1], 10);
                }
              } else if (line.trim()) {
                currentCriterion.description += line.trim() + ' ';
              }
            }
          }
          
          // Add the last criterion
          if (currentCriterion) {
            criteria.push(currentCriterion);
          }
          
          return { criteria, rawResponse: text };
        } catch (error) {
          console.error('Error parsing criteria response:', error);
          return {
            criteria: [],
            rawResponse: response.text
          };
        }
      }),
      catchError(error => {
        console.error('Error getting evaluation criteria suggestions:', error);
        this.aiStatusSubject.next('error');
        return of({
          criteria: [],
          message: 'Failed to get evaluation criteria suggestions. Please try again.'
        });
      }),
      finalize(() => this.aiStatusSubject.next('idle'))
    );
  }
}