import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'crowdsource-theme';
  private isBrowser: boolean;
  private _currentTheme = new BehaviorSubject<ThemeMode>('dark');
  
  public currentTheme$ = this._currentTheme.asObservable();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initTheme();
  }

  private initTheme(): void {
    if (!this.isBrowser) return;
    
    // Get saved theme from localStorage or use default
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode | null;
    const theme = savedTheme || 'dark'; // Default to dark theme
    
    this.setTheme(theme);
  }

  public setTheme(theme: ThemeMode): void {
    if (!this.isBrowser) return;

    // Update theme subject
    this._currentTheme.next(theme);
    
    // Store in localStorage
    localStorage.setItem(this.THEME_KEY, theme);
    
    // Apply theme class to body
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    }
  }

  public toggleTheme(): void {
    const current = this._currentTheme.getValue();
    const newTheme: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  public get isDarkTheme(): boolean {
    return this._currentTheme.getValue() === 'dark';
  }
}