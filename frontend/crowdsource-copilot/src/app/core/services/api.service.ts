import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
    // Bind the handleError method to this instance
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Generic GET method for HTTP requests
   * @param path API endpoint path
   * @param params Optional HTTP parameters
   * @returns Observable of response type T
   */
  get<T>(path: string, params: any = {}): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: this.buildParams(params)
    };

    return this.http.get<T>(`${this.environmentService.apiUrl}${path}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic POST method for HTTP requests
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of response type T
   */
  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.environmentService.apiUrl}${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PUT method for HTTP requests
   * @param path API endpoint path
   * @param body Request body
   * @returns Observable of response type T
   */
  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.environmentService.apiUrl}${path}`, body, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic DELETE method for HTTP requests
   * @param path API endpoint path
   * @returns Observable of response type T
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.environmentService.apiUrl}${path}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Set up common headers for API requests
   * @returns HttpHeaders object with common headers
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Build HTTP params from object
   * @param params Object with params
   * @returns HttpParams instance
   */
  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return httpParams;
  }

  /**
   * Error handler for HTTP requests
   * @param error Error object
   * @returns Observable with error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    try {
      // Check if we're in a browser environment AND if error.error is an ErrorEvent
      if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        const status = error.status || 'unknown';
        const message = error.error?.message || error.message || 'No details available';
        errorMessage = `API error (${status}): ${message}`;
      }
    } catch (e) {
      console.error('Error while handling another error:', e);
    }
    
    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}