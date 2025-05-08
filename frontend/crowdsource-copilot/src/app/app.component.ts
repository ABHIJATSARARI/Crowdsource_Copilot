import { Component, OnInit, EventEmitter } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { fadeInContent, listStagger } from './shared/animations';
import { AiService, AIHealthStatus } from './core/services/ai.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="connection-status-container" [class.expanded]="expanded">
      <div class="status-indicators">
        <div class="status-item">
          <span class="status-label">Backend:</span>
          <div class="status-badge" [class.connected]="backendConnected" [class.disconnected]="backendConnected === false">
            <mat-icon>{{ backendConnected ? 'check_circle' : 'error' }}</mat-icon>
            {{ backendConnected ? 'Connected' : 'Disconnected' }}
          </div>
        </div>
        <div class="status-item" *ngIf="backendConnected">
          <span class="status-label">AI Service:</span>
          <div class="status-badge" 
               [class.connected]="aiHealth?.isHealthy" 
               [class.disconnected]="aiHealth?.isHealthy === false" 
               [class.unknown]="aiHealth === null">
            <mat-icon>{{ 
              aiHealth?.isHealthy ? 'check_circle' : 
              aiHealth?.isHealthy === false ? 'error' : 'help'
            }}</mat-icon>
            {{ 
              aiHealth?.isHealthy ? 'Healthy' : 
              aiHealth?.isHealthy === false ? 'Unhealthy' : 'Unknown'
            }}
          </div>
        </div>
      </div>
      <div class="status-details" *ngIf="expanded && aiHealth">
        <div class="detail-item">
          <span class="detail-label">Provider:</span>
          <span class="detail-value">{{ aiHealth.provider || 'Unknown' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Initialized:</span>
          <span class="detail-value">{{ aiHealth.initialized ? 'Yes' : 'No' }}</span>
        </div>
        <div class="detail-item" *ngIf="aiHealth.lastChecked">
          <span class="detail-label">Last checked:</span>
          <span class="detail-value">{{ formatDateTime(aiHealth.lastChecked) }}</span>
        </div>
        <div class="detail-item error" *ngIf="aiHealth.lastError">
          <span class="detail-label">Error:</span>
          <span class="detail-value">{{ aiHealth.lastError }}</span>
        </div>
        <div class="message" *ngIf="!aiHealth.isHealthy">
          <p>AI service is not properly configured.</p>
          <p>Please contact the administrator to set up API keys in the backend environment.</p>
        </div>
        <button mat-button class="neon-button" (click)="refresh.emit()">
          Refresh Status
        </button>
      </div>
      <button mat-icon-button class="toggle-button" (click)="expanded = !expanded" [matTooltip]="expanded ? 'Collapse' : 'Show details'">
        <mat-icon>{{ expanded ? 'expand_less' : 'expand_more' }}</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .connection-status-container {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 8px 12px;
      box-shadow: var(--shadow-md);
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
      max-width: 300px;
      overflow: hidden;
      transition: all 0.3s ease;
      border: var(--border-light);
    }
    
    .connection-status-container:hover {
      box-shadow: var(--shadow-primary);
    }
    
    .status-indicators {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .status-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .status-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 12px;
    }
    
    .status-badge.connected {
      background-color: rgba(16, 185, 129, 0.2);
      color: var(--accent-success-light);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .status-badge.disconnected {
      background-color: rgba(239, 68, 68, 0.2);
      color: var(--accent-error-light);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .status-badge.unknown {
      background-color: rgba(245, 158, 11, 0.2);
      color: var(--accent-warning-light);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .status-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    .toggle-button {
      align-self: center;
      margin-top: 4px;
      width: 24px;
      height: 24px;
      color: var(--text-secondary);
    }
    
    .status-details {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }
    
    .detail-label {
      color: var(--text-tertiary);
      font-weight: 500;
    }
    
    .detail-value {
      color: var(--text-primary);
    }
    
    .detail-item.error .detail-value {
      color: var(--accent-error);
    }
    
    .message {
      border-left: 3px solid var(--accent-error);
      padding-left: 8px;
      margin: 8px 0;
      font-size: 12px;
      color: var(--accent-error-light);
    }
    
    .message p {
      margin: 4px 0;
    }
    
    .expanded {
      min-width: 280px;
    }
  `],
  outputs: ['refresh'],
  inputs: ['backendConnected', 'aiHealth']
})
export class ConnectionStatusComponent {
  backendConnected: boolean | null = null;
  aiHealth: AIHealthStatus | null = null;
  expanded = false;
  refresh = new EventEmitter<void>();
  
  formatDateTime(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    } catch {
      return dateTimeString;
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDialogModule,
    ConnectionStatusComponent
  ],
  template: `
    <div class="app-container tech-grid">
      <mat-toolbar class="app-header" @fadeInContent>
        <div class="header-container">
          <div class="logo-title">
            <button mat-icon-button class="menu-button" (click)="toggleSidenav()" matTooltip="Menu">
              <mat-icon class="animated-icon">menu</mat-icon>
            </button>
            <div class="brand" routerLink="/dashboard">
              <img src="/logo.png" alt="Crowdsource Copilot" class="logo-image">
              <span class="app-title neon-text">Crowdsource Copilot</span>
            </div>
          </div>
          <div class="header-actions">
            <button mat-button class="nav-button" routerLink="/dashboard" routerLinkActive="active">
              <mat-icon class="material-icons-round">dashboard</mat-icon>
              <span>Dashboard</span>
            </button>
            <button mat-button class="nav-button" routerLink="/wizard" routerLinkActive="active">
              <mat-icon class="material-icons-round">add_circle</mat-icon>
              <span>Create Challenge</span>
            </button>
            <button mat-button class="nav-button" routerLink="/support" routerLinkActive="active">
              <mat-icon class="material-icons-round">help</mat-icon>
              <span>Support</span>
            </button>
            <button mat-icon-button class="notification-button" [matMenuTriggerFor]="notificationMenu" matTooltip="Notifications">
              <mat-icon [matBadge]="3" matBadgeColor="warn" class="material-icons-round">notifications</mat-icon>
            </button>
            <mat-menu #notificationMenu="matMenu" class="notification-menu">
              <div class="notification-header">
                <h3>Notifications</h3>
                <button mat-button color="primary">Mark all read</button>
              </div>
              <mat-divider></mat-divider>
              <div class="notification-list">
                <button mat-menu-item class="notification-item unread">
                  <mat-icon color="primary" class="material-icons-round">comment</mat-icon>
                  <div class="notification-content">
                    <div class="notification-title">New comment on AI Challenge</div>
                    <div class="notification-meta">5 minutes ago</div>
                  </div>
                </button>
                <button mat-menu-item class="notification-item unread">
                  <mat-icon color="accent" class="material-icons-round">group</mat-icon>
                  <div class="notification-content">
                    <div class="notification-title">New submission</div>
                    <div class="notification-meta">1 hour ago</div>
                  </div>
                </button>
                <button mat-menu-item class="notification-item unread">
                  <mat-icon color="warn" class="material-icons-round">notifications_active</mat-icon>
                  <div class="notification-content">
                    <div class="notification-title">Challenge deadline approaching</div>
                    <div class="notification-meta">Yesterday at 8:30 PM</div>
                  </div>
                </button>
                <div class="notification-footer">
                  <a mat-button color="primary" routerLink="/notifications">View all notifications</a>
                </div>
              </div>
            </mat-menu>
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-button" matTooltip="User menu">
              <div class="user-avatar">JS</div>
            </button>
            <mat-menu #userMenu="matMenu" class="user-profile-menu">
              <div class="user-info">
                <div class="user-avatar-large">JS</div>
                <div class="user-details">
                  <div class="user-name neon-text">John Smith</div>
                  <div class="user-email">john.smith&#64;example.com</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item class="profile-menu-item">
                <mat-icon class="material-icons-round">person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item class="profile-menu-item">
                <mat-icon class="material-icons-round">settings</mat-icon>
                <span>Settings</span>
              </button>
              <button mat-menu-item class="profile-menu-item">
                <mat-icon class="material-icons-round">help</mat-icon>
                <span>Help & Support</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item class="logout-button">
                <mat-icon class="material-icons-round">exit_to_app</mat-icon>
                <span>Sign Out</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="over" class="sidenav" [opened]="sidenavOpen" (closed)="sidenavOpen = false">
          <div class="sidenav-header">
            <div class="brand">
              <img src="/logo.png" alt="Crowdsource Copilot" class="logo-image">
              <span class="app-title neon-text">Crowdsource Copilot</span>
            </div>
            <button mat-icon-button (click)="toggleSidenav()" matTooltip="Close menu">
              <mat-icon class="material-icons-round">close</mat-icon>
            </button>
          </div>
          <mat-divider></mat-divider>
          <div class="user-profile-card">
            <div class="user-avatar-large energy-pulse">JS</div>
            <div class="user-info-card">
              <div class="user-name neon-text">John Smith</div>
              <div class="user-role">Admin</div>
            </div>
          </div>
          <mat-nav-list @listStagger class="futuristic-nav">
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/wizard" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">add_circle</mat-icon>
              <span matListItemTitle>Create Challenge</span>
            </a>
            <a mat-list-item routerLink="/challenges" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">emoji_events</mat-icon>
              <span matListItemTitle>My Challenges</span>
            </a>
            <a mat-list-item routerLink="/ai-assistant" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">smart_toy</mat-icon>
              <span matListItemTitle>AI Assistant</span>
            </a>
            <a mat-list-item routerLink="/analytics" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">insights</mat-icon>
              <span matListItemTitle>Analytics</span>
            </a>
            <mat-divider></mat-divider>
            <h3 matSubheader>Recent Challenges</h3>
            <a mat-list-item (click)="sidenav.close()" class="recent-item">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">code</mat-icon>
              <span matListItemTitle>AI Development Challenge</span>
            </a>
            <a mat-list-item (click)="sidenav.close()" class="recent-item">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">design_services</mat-icon>
              <span matListItemTitle>UX Design Innovation</span>
            </a>
            <a mat-list-item (click)="sidenav.close()" class="recent-item">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">biotech</mat-icon>
              <span matListItemTitle>Healthcare Solutions</span>
            </a>
            <mat-divider></mat-divider>
            <h3 matSubheader>Settings</h3>
            <a mat-list-item routerLink="/settings" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">settings</mat-icon>
              <span matListItemTitle>User Settings</span>
            </a>
            <a mat-list-item routerLink="/support" routerLinkActive="active-link" (click)="sidenav.close()">
              <mat-icon matListItemIcon class="material-icons-round nav-icon">help</mat-icon>
              <span matListItemTitle>Support</span>
            </a>
          </mat-nav-list>
          <div class="sidenav-footer">
            <mat-divider></mat-divider>
            <div class="footer-content">
              <span>© 2025 Crowdsource Copilot</span>
              <div class="footer-links">
                <a href="#">Terms</a>
                <span class="divider">·</span>
                <a href="#">Privacy</a>
              </div>
            </div>
          </div>
        </mat-sidenav>
        
        <mat-sidenav-content class="dot-matrix">
          <div class="app-content">
            <router-outlet></router-outlet>
          </div>
          
          <app-connection-status
            [backendConnected]="backendConnected"
            [aiHealth]="aiHealth"
            (refresh)="refreshConnectionStatus()"
          ></app-connection-status>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }
    
    /* Enhanced Header Styling */
    .app-header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(90deg, var(--bg-secondary), var(--bg-primary));
      color: var(--text-primary);
      box-shadow: var(--shadow-primary);
      height: 64px;
      padding: 0;
      transition: all 0.3s ease;
      border-bottom: var(--border-light);
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 16px;
      height: 100%;
    }
    
    /* Improved Brand & Logo */
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      text-decoration: none;
      color: var(--text-primary);
      height: 40px;
      padding: 0 8px;
      border-radius: var(--border-radius);
      transition: background-color 0.2s ease, transform 0.3s ease;
    }
    
    .brand:hover {
      background-color: rgba(157, 120, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .logo-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo-image {
      height: 36px;
      width: auto;
      border-radius: var(--border-radius-sm);
      transition: transform 0.3s ease;
      filter: drop-shadow(0 0 8px rgba(157, 120, 255, 0.5));
    }
    
    .brand:hover .logo-image {
      transform: scale(1.05);
      filter: drop-shadow(0 0 12px rgba(157, 120, 255, 0.7));
    }
    
    .app-title {
      font-size: 18px;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 0.5px;
    }
    
    /* Animated Menu Icon */
    .menu-button {
      color: var(--text-primary);
      background-color: rgba(157, 120, 255, 0.1);
      transition: all 0.2s ease;
    }
    
    .menu-button:hover {
      background-color: rgba(157, 120, 255, 0.2);
      transform: rotate(90deg);
      box-shadow: var(--shadow-primary);
    }
    
    .animated-icon {
      transition: all 0.3s ease;
    }
    
    /* Improved Navigation Buttons */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-button {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      border-radius: var(--border-radius);
      transition: all 0.2s ease;
      padding: 0 16px;
      height: 40px;
      position: relative;
      color: var(--text-primary);
      font-size: 14px;
      letter-spacing: 0.3px;
      overflow: hidden;
    }
    
    .nav-button:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--gradient-tech);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
      opacity: 0.7;
    }
    
    .nav-button:hover {
      background-color: rgba(157, 120, 255, 0.1);
    }
    
    .nav-button:hover:after {
      transform: scaleX(1);
      transform-origin: left;
    }
    
    .nav-button mat-icon {
      color: var(--primary-600);
      opacity: 0.9;
    }
    
    .nav-button.active {
      background-color: rgba(157, 120, 255, 0.15);
    }
    
    .nav-button.active::after {
      transform: scaleX(1);
      opacity: 1;
      box-shadow: 0 0 8px rgba(157, 120, 255, 0.5);
    }
    
    /* Improved Notification Button */
    .notification-button {
      margin: 0 4px;
      color: var(--text-primary);
      background-color: rgba(157, 120, 255, 0.1);
    }
    
    .notification-button:hover {
      background-color: rgba(157, 120, 255, 0.2);
      animation: pulse 1s infinite;
      box-shadow: var(--shadow-primary);
    }
    
    /* Add custom badge styling */
    ::ng-deep .notification-button .mat-badge-content {
      font-size: 10px;
      font-weight: 600;
      width: 18px;
      height: 18px;
      line-height: 18px;
      background-color: var(--accent-error);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px rgba(var(--accent-error-rgb), 0.7);
    }
    
    /* Enhanced User Menu Button */
    .user-menu-button {
      margin-left: 8px;
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    
    .user-menu-button:hover {
      transform: translateY(-2px);
    }
    
    /* Colorful User Avatar */
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--border-radius-full);
      background: linear-gradient(135deg, var(--primary-600), var(--secondary-600));
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      box-shadow: var(--shadow-primary);
      border: 2px solid rgba(157, 120, 255, 0.3);
    }
    
    .user-avatar-large {
      width: 50px;
      height: 50px;
      border-radius: var(--border-radius-full);
      background: linear-gradient(135deg, var(--primary-600), var(--secondary-600));
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      box-shadow: var(--shadow-primary);
      border: 2px solid var(--primary-300);
    }
    
    /* Improved Sidenav */
    .sidenav-container {
      flex: 1;
      height: calc(100% - 64px);
    }
    
    .sidenav {
      width: 280px;
      background-color: var(--bg-secondary);
      border-right: none;
      box-shadow: var(--shadow-lg);
    }
    
    .sidenav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      height: 64px;
    }
    
    /* Enhanced User profile card in sidebar */
    .user-profile-card {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, rgba(157, 120, 255, 0.1), rgba(92, 225, 255, 0.05));
      border-radius: var(--border-radius-lg);
      margin: 0 12px 16px;
      box-shadow: var(--shadow-sm);
      border: var(--border-light);
      position: relative;
      overflow: hidden;
    }
    
    .user-profile-card:after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: var(--gradient-holographic);
      opacity: 0.05;
      transform: rotate(-45deg);
      animation: holographic-shift 15s linear infinite;
      pointer-events: none;
    }
    
    .user-info-card {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .user-role {
      font-size: 12px;
      background: var(--gradient-tech);
      color: var(--text-primary);
      padding: 3px 10px;
      border-radius: var(--border-radius-full);
      display: inline-block;
      margin-top: 4px;
      font-weight: 500;
      box-shadow: var(--shadow-primary);
    }
    
    /* Enhanced Sidebar navigation */
    .futuristic-nav {
      padding-top: 0;
    }
    
    .futuristic-nav a {
      border-radius: 0 24px 24px 0;
      margin: 4px 8px 4px 0;
      height: 48px;
      color: var(--text-primary);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .futuristic-nav a:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--primary-600);
      transform: scaleY(0);
      transition: transform 0.2s ease;
      opacity: 0;
    }
    
    .futuristic-nav a:hover:before {
      transform: scaleY(1);
      opacity: 1;
    }
    
    .futuristic-nav a:hover {
      background-color: var(--bg-tertiary);
      transform: translateX(4px);
    }
    
    .futuristic-nav a.active-link {
      background: linear-gradient(90deg, rgba(157, 120, 255, 0.1), rgba(157, 120, 255, 0.05));
      color: var(--primary-600);
      border-left: 4px solid var(--primary-600);
      box-shadow: inset 0 0 10px rgba(157, 120, 255, 0.1);
    }
    
    .futuristic-nav a.active-link mat-icon {
      color: var(--primary-600);
      text-shadow: 0 0 8px rgba(157, 120, 255, 0.5);
    }
    
    .nav-icon {
      color: var(--primary-600);
      margin-right: 16px;
      transition: transform 0.3s ease;
    }
    
    .futuristic-nav a:hover .nav-icon {
      transform: scale(1.1);
      animation: pulse 2s infinite;
    }
    
    /* Recent challenges styling */
    .recent-item {
      position: relative;
    }
    
    .recent-item::before {
      content: '';
      position: absolute;
      left: 16px;
      width: 6px;
      height: 6px;
      background-color: var(--secondary-600);
      border-radius: 50%;
      top: 22px;
      z-index: 1;
      box-shadow: 0 0 10px var(--secondary-600);
    }
    
    /* Improved Sidebar footer */
    .sidenav-footer {
      margin-top: auto;
    }
    
    .footer-content {
      padding: 16px;
      font-size: 12px;
      color: var(--text-tertiary);
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: center;
    }
    
    .footer-links {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    
    .footer-links a {
      color: var(--primary-600);
      text-decoration: none;
    }
    
    .footer-links a:hover {
      color: var(--primary-500);
      text-decoration: underline;
    }
    
    .divider {
      color: var(--text-tertiary);
    }
    
    /* Enhanced Main content */
    .app-content {
      padding: 24px;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      min-height: calc(100% - 48px); /* Account for padding */
      position: relative;
      z-index: 1;
    }
    
    /* Enhanced Notification menu customizations */
    ::ng-deep .notification-menu {
      max-width: 320px !important;
      width: 320px;
      border-radius: var(--border-radius) !important;
      overflow: hidden;
      margin-top: 8px !important;
      box-shadow: var(--shadow-lg) !important;
      background: var(--bg-card) !important;
      border: var(--border-light) !important;
    }
    
    ::ng-deep .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(90deg, rgba(157, 120, 255, 0.05), rgba(157, 120, 255, 0.1));
    }
    
    ::ng-deep .notification-header h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: var(--primary-600);
    }
    
    ::ng-deep .notification-list {
      max-height: 360px;
      overflow-y: auto;
    }
    
    ::ng-deep .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      height: auto !important;
      transition: all 0.2s ease;
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .notification-item:hover {
      background-color: var(--bg-tertiary);
    }
    
    ::ng-deep .notification-item.unread {
      background-color: rgba(157, 120, 255, 0.05);
      position: relative;
    }
    
    ::ng-deep .notification-item.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--primary-600);
    }
    
    ::ng-deep .notification-content {
      margin-left: 12px;
      flex: 1;
    }
    
    ::ng-deep .notification-title {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    ::ng-deep .notification-meta {
      font-size: 12px;
      color: var(--text-tertiary);
      margin-top: 4px;
    }
    
    ::ng-deep .notification-footer {
      display: flex;
      justify-content: center;
      padding: 8px 0;
      border-top: 1px solid var(--border-light);
      background: linear-gradient(90deg, rgba(157, 120, 255, 0.03), rgba(157, 120, 255, 0.07));
    }
    
    /* Enhanced User profile menu customization */
    ::ng-deep .user-profile-menu {
      min-width: 280px !important;
      border-radius: var(--border-radius) !important;
      overflow: hidden;
      margin-top: 8px !important;
      box-shadow: var(--shadow-lg) !important;
      background: var(--bg-card) !important;
      border: var(--border-light) !important;
    }
    
    ::ng-deep .user-info {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, rgba(157, 120, 255, 0.1), rgba(92, 225, 255, 0.05));
    }
    
    ::ng-deep .user-details {
      flex: 1;
    }
    
    ::ng-deep .user-email {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    
    ::ng-deep .profile-menu-item {
      transition: all 0.2s ease;
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .profile-menu-item:hover {
      background-color: var(--bg-tertiary);
    }
    
    ::ng-deep .profile-menu-item mat-icon {
      color: var(--primary-600);
      margin-right: 8px;
    }
    
    ::ng-deep .logout-button {
      color: var(--accent-error) !important;
    }
    
    ::ng-deep .logout-button mat-icon {
      color: var(--accent-error) !important;
    }
    
    /* Enhanced Section headers in sidebar */
    h3[matSubheader] {
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 600;
      margin: 16px 16px 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
    }
    
    h3[matSubheader]::after {
      content: '';
      height: 1px;
      flex: 1;
      background: linear-gradient(to right, var(--primary-500), transparent);
      margin-left: 8px;
    }
    
    /* Animations */
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .nav-button span {
        display: none;
      }
      
      .app-content {
        padding: 16px;
      }
      
      .app-title {
        display: none;
      }
      
      .logo-image {
        height: 32px;
      }
    }
    
    @media (max-width: 480px) {
      .sidenav {
        width: 85vw;
      }
    }
  `],
  animations: [fadeInContent, listStagger]
})
export class AppComponent implements OnInit {
  title = 'Crowdsource Copilot';
  sidenavOpen = false;
  
  // Connection status
  backendConnected: boolean | null = null;
  aiHealth: AIHealthStatus | null = null;

  constructor(
    private aiService: AiService,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Check backend connection on init
    this.checkConnectionStatus();

    // Subscribe to connection status changes
    this.aiService.backendConnected$.subscribe(status => {
      this.backendConnected = status;
      if (status === false) {
        this.showConnectionError();
      }
    });

    // Subscribe to AI health status changes
    this.aiService.aiHealth$.subscribe(health => {
      this.aiHealth = health;
      
      // Show warning if AI service is unhealthy
      if (health && !health.isHealthy) {
        this.showAIServiceWarning(health.lastError);
      }
    });
    
    // Theme is now handled by ThemeService, which safely checks for browser environment
    // No direct document manipulation here
  }

  checkConnectionStatus() {
    this.aiService.checkBackendConnection().subscribe();
  }

  refreshConnectionStatus() {
    this.checkConnectionStatus();
  }

  showConnectionError() {
    this.snackBar.open(
      'Unable to connect to the backend server. Some features may not work.',
      'Retry',
      { duration: 8000 }
    ).onAction().subscribe(() => {
      this.checkConnectionStatus();
    });
  }

  showAIServiceWarning(error: string | null) {
    this.snackBar.open(
      `AI service is not properly configured. ${error || 'Please check backend environment variables.'}`,
      'Dismiss',
      { duration: 8000 }
    );
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
