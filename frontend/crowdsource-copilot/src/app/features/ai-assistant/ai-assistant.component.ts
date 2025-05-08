import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AiService, AIRequest } from '../../core/services/ai.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  template: `
    <div class="assistant-container" [class.expanded]="isExpanded" [class.minimized]="isMinimized">
      <div class="cyber-frame"></div>
      <div class="assistant-header">
        <div class="assistant-title" (click)="toggleMinimized()">
          <div class="ai-icon-wrapper">
            <mat-icon class="ai-icon">smart_toy</mat-icon>
            <div class="ai-icon-rings">
              <div class="ring ring1"></div>
              <div class="ring ring2"></div>
            </div>
          </div>
          <span class="assistant-name neon-text">Neural Copilot</span>
          <div class="status-indicator" [class.active]="!isLoading"></div>
        </div>
        <div class="assistant-controls">
          <button 
            mat-icon-button 
            matTooltip="Expand/Collapse" 
            (click)="toggleExpanded()"
            *ngIf="!isMinimized">
            <mat-icon>{{ isExpanded ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
          </button>
          <button 
            mat-icon-button 
            matTooltip="{{ isMinimized ? 'Maximize' : 'Minimize' }}" 
            (click)="toggleMinimized()">
            <mat-icon>{{ isMinimized ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
        </div>
      </div>
      
      <div class="assistant-content" *ngIf="!isMinimized">
        <div class="messages-container">
          <div class="tech-grid-background"></div>
          <!-- Welcome message -->
          <div class="message assistant-message" *ngIf="messages.length === 0">
            <div class="assistant-avatar">
              <mat-icon>smart_toy</mat-icon>
              <div class="pulse-ring"></div>
            </div>
            <div class="message-content ai-message-bubble">
              <p>Hello! I'm your Neural Copilot, an advanced AI assistant for innovation challenges. How can I assist you today?</p>
              <p class="suggestion-prompt">Quick suggestions:</p>
              <div class="suggestion-buttons">
                <button mat-stroked-button class="suggestion-button" (click)="askSuggestion('What makes a good problem statement?')">
                  <mat-icon>lightbulb</mat-icon>
                  Problem Statements
                </button>
                <button mat-stroked-button class="suggestion-button" (click)="askSuggestion('How do I set appropriate prize amounts?')">
                  <mat-icon>emoji_events</mat-icon>
                  Prize Amounts
                </button>
                <button mat-stroked-button class="suggestion-button" (click)="askSuggestion('What timeline is best for my challenge?')">
                  <mat-icon>schedule</mat-icon>
                  Timeline Advice
                </button>
              </div>
            </div>
            <div class="message-time">
              {{ now | date:'shortTime' }}
            </div>
          </div>
          
          <!-- Message history -->
          <div 
            *ngFor="let message of messages" 
            class="message"
            [class.user-message]="message.isUser"
            [class.assistant-message]="!message.isUser">
            
            <div *ngIf="!message.isUser" class="assistant-avatar">
              <mat-icon>smart_toy</mat-icon>
              <div class="pulse-ring"></div>
            </div>
            
            <div class="message-content" [class.ai-message-bubble]="!message.isUser" [class.user-message-bubble]="message.isUser">
              <p [innerHTML]="formatMessage(message.content)"></p>
            </div>
            
            <div *ngIf="message.isUser" class="user-avatar">
              <span>U</span>
              <div class="user-pulse-ring"></div>
            </div>
            
            <div class="message-time" [class.user-time]="message.isUser">
              {{ message.timestamp | date:'shortTime' }}
            </div>
          </div>
          
          <!-- Loading indicator -->
          <div class="message assistant-message" *ngIf="isLoading">
            <div class="assistant-avatar">
              <mat-icon>smart_toy</mat-icon>
              <div class="pulse-ring animated"></div>
            </div>
            <div class="message-content ai-message-bubble loading-message">
              <div class="loading-indicator">
                <div class="neural-activity">
                  <div class="neural-dot" *ngFor="let i of [1,2,3,4,5,6]"></div>
                </div>
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Context panel (only in expanded view) -->
        <div class="context-panel" *ngIf="isExpanded">
          <div class="context-header">
            <div class="context-icon">
              <mat-icon>memory</mat-icon>
              <div class="icon-glow"></div>
            </div>
            <h3 class="neon-text">Neural Context</h3>
          </div>
          <div class="tech-circuit"></div>
          <mat-divider></mat-divider>
          
          <mat-accordion class="futuristic-accordion">
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <div class="panel-title-content">
                    <mat-icon>flag</mat-icon>
                    <span>Current Process</span>
                  </div>
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="panel-content">
                <p class="data-label">Active Step</p>
                <p class="neon-text">{{ currentStepName }}</p>
                <div class="glitch-divider"></div>
                <p>{{ currentStepDescription }}</p>
              </div>
            </mat-expansion-panel>
            
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <div class="panel-title-content">
                    <mat-icon>category</mat-icon>
                    <span>Challenge Type</span>
                  </div>
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="panel-content">
                <div class="challenge-type-wrapper">
                  <p class="neon-text-cyan">{{ contextData?.challengeType || 'Not defined' }}</p>
                  <div class="type-indicator"></div>
                </div>
              </div>
            </mat-expansion-panel>
            
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <div class="panel-title-content">
                    <mat-icon>summarize</mat-icon>
                    <span>Challenge Summary</span>
                  </div>
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="panel-content">
                <p *ngIf="!contextData?.title" class="no-data">No challenge data initialized</p>
                <div *ngIf="contextData?.title">
                  <div class="data-item">
                    <p class="data-label">Title</p>
                    <p class="neon-text">{{ contextData?.title }}</p>
                  </div>
                  <div class="data-item">
                    <p class="data-label">Problem Statement</p>
                    <p>{{ truncateText(contextData?.problem, 150) }}</p>
                  </div>
                  <div class="data-item">
                    <div class="data-metrics">
                      <div class="metric">
                        <p class="data-label">Duration</p>
                        <p class="neon-text-cyan">{{ contextData?.duration }} days</p>
                      </div>
                      <div class="metric" *ngIf="contextData?.participantCount">
                        <p class="data-label">Target</p>
                        <p class="neon-text-cyan">{{ contextData?.participantCount }} participants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-expansion-panel>
          </mat-accordion>

          <div class="ai-capabilities">
            <h4>AI Analysis</h4>
            <div class="capability">
              <mat-icon>insights</mat-icon>
              <div class="capability-info">
                <span>Sentiment Analysis</span>
                <div class="capability-bar">
                  <div class="bar-fill" style="width: 80%"></div>
                </div>
              </div>
            </div>
            <div class="capability">
              <mat-icon>psychology</mat-icon>
              <div class="capability-info">
                <span>Engagement Prediction</span>
                <div class="capability-bar">
                  <div class="bar-fill" style="width: 65%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input area -->
      <div class="assistant-input" *ngIf="!isMinimized">
        <mat-form-field appearance="outline" class="input-field">
          <mat-label>Ask Neural Copilot...</mat-label>
          <input 
            matInput 
            [(ngModel)]="userQuery"
            (keyup.enter)="submitQuery()"
            placeholder="e.g., 'Suggest timeline for a two-week challenge'"
          >
          <mat-icon matPrefix>help_outline</mat-icon>
        </mat-form-field>
        <button 
          mat-fab
          class="send-button"
          [disabled]="!userQuery || isLoading"
          (click)="submitQuery()"
          matTooltip="Send message">
          <mat-icon>send</mat-icon>
          <div class="button-glow"></div>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .assistant-container {
      background-color: var(--bg-card);
      border-radius: var(--border-radius-lg);
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      height: 520px;
      z-index: 1000;
      overflow: hidden;
      box-shadow: var(--shadow-lg), 0 0 25px rgba(124, 58, 237, 0.2);
    }
    
    .cyber-frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border: 1px solid rgba(124, 58, 237, 0.3);
      border-radius: inherit;
      box-shadow: inset 0 0 15px rgba(124, 58, 237, 0.1);
      
      &::before, &::after {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        border-color: var(--primary-600);
        z-index: 2;
      }
      
      &::before {
        top: 0;
        left: 0;
        border-top: 2px solid;
        border-left: 2px solid;
        box-shadow: -2px -2px 8px rgba(124, 58, 237, 0.3);
      }
      
      &::after {
        bottom: 0;
        right: 0;
        border-bottom: 2px solid;
        border-right: 2px solid;
        box-shadow: 2px 2px 8px rgba(124, 58, 237, 0.3);
      }
    }
    
    .expanded {
      width: 700px;
      height: 650px;
    }
    
    .minimized {
      height: 56px;
      width: 280px;
    }
    
    .assistant-header {
      background: linear-gradient(90deg, var(--bg-secondary), var(--bg-tertiary));
      color: var(--text-primary);
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: var(--border-light);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent 5%, 
          var(--primary-500) 50%, 
          transparent 95%);
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(
            circle at 30% 50%, 
            rgba(157, 120, 255, 0.08),
            transparent 70%
          );
        z-index: 0;
      }
    }
    
    .assistant-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      z-index: 1;
      position: relative;
    }
    
    .ai-icon-wrapper {
      position: relative;
      width: 24px;
      height: 24px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .assistant-title .ai-icon {
      color: var(--primary-600);
      animation: pulse 2s infinite;
      position: relative;
      z-index: 2;
    }
    
    .ai-icon-rings {
      position: absolute;
      inset: -4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid var(--primary-500);
      opacity: 0.5;
      width: 100%;
      height: 100%;
    }
    
    .ring1 {
      animation: ring-pulse 2s infinite;
    }
    
    .ring2 {
      animation: ring-pulse 2s infinite 0.5s;
    }
    
    @keyframes ring-pulse {
      0% { transform: scale(0.8); opacity: 0.7; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    
    .assistant-name {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-shadow: 0 0 6px rgba(157, 120, 255, 0.5);
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: 8px;
      background-color: var(--secondary-600);
      position: relative;
    }
    
    .status-indicator.active {
      animation: glow 1.5s infinite alternate;
      
      &::after {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 1px solid var(--secondary-500);
        opacity: 0.5;
        animation: ring-pulse 2s infinite;
      }
    }
    
    @keyframes glow {
      from { box-shadow: 0 0 2px var(--secondary-600); }
      to { box-shadow: 0 0 10px var(--secondary-600); }
    }
    
    .assistant-controls {
      display: flex;
      gap: 4px;
      z-index: 1;
      position: relative;
    }
    
    .assistant-controls button {
      color: var(--text-secondary);
    }
    
    .assistant-controls button:hover {
      color: var(--primary-600);
      background-color: rgba(157, 120, 255, 0.1);
    }
    
    .assistant-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      background-color: var(--bg-secondary);
    }
    
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      scrollbar-width: thin;
    }
    
    .tech-grid-background {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.03;
      background: 
        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
      background-size: var(--grid-size) var(--grid-size);
    }
    
    .context-panel {
      width: 280px;
      padding: 16px;
      border-left: 1px solid var(--border-light);
      overflow-y: auto;
      background-color: var(--bg-primary);
      position: relative;
      scrollbar-width: thin;
    }
    
    .context-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .context-icon {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      mat-icon {
        color: var(--primary-600);
        font-size: 20px;
        height: 20px;
        width: 20px;
        position: relative;
        z-index: 2;
      }
      
      .icon-glow {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent 70%);
      }
    }
    
    .context-panel h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .tech-circuit {
      position: absolute;
      top: 40px;
      right: 10px;
      width: 80px;
      height: 80px;
      background-image: 
        radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 2px, transparent 2px),
        linear-gradient(to right, transparent 47%, rgba(124, 58, 237, 0.1) 49%, transparent 51%),
        linear-gradient(to bottom, transparent 47%, rgba(124, 58, 237, 0.1) 49%, transparent 51%);
      background-size: 10px 10px, 10px 10px, 10px 10px;
      opacity: 0.4;
      pointer-events: none;
    }
    
    .message {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      max-width: 90%;
      position: relative;
      z-index: 1;
    }
    
    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    
    .assistant-message {
      align-self: flex-start;
    }
    
    .message-content {
      padding: 12px 16px;
      border-radius: var(--border-radius);
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      z-index: 1;
    }
    
    .user-message-bubble, .ai-message-bubble {
      box-shadow: var(--shadow-md);
    }
    
    .user-message-bubble {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
      color: white;
      border-radius: var(--border-radius) var(--border-radius) 0 var(--border-radius);
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
      }
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30%;
        background: linear-gradient(
          to bottom, 
          transparent, 
          rgba(0, 0, 0, 0.1)
        );
        z-index: -1;
      }
    }
    
    .ai-message-bubble {
      background-color: var(--bg-tertiary);
      color: var(--text-primary);
      border-radius: var(--border-radius) var(--border-radius) var(--border-radius) 0;
      border-left: 3px solid var(--primary-600);
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          to right,
          var(--primary-600),
          transparent 80%
        );
      }
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 20%;
        height: 1px;
        background: var(--primary-600);
      }
    }
    
    .message-content p {
      margin: 0 0 8px 0;
    }
    
    .message-content p:last-child {
      margin-bottom: 0;
    }
    
    .message-time {
      font-size: 11px;
      color: var(--text-tertiary);
      margin-top: 4px;
      padding: 0 8px;
      align-self: flex-start;
    }
    
    .user-time {
      align-self: flex-end;
      text-align: right;
    }
    
    .suggestion-prompt {
      margin-top: 16px;
      font-weight: 500;
      color: var(--primary-500);
    }
    
    .suggestion-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .suggestion-button {
      background-color: rgba(157, 120, 255, 0.1);
      border: 1px solid var(--primary-400);
      color: var(--primary-500);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: var(--border-radius-full);
      transition: all 0.2s ease;
    }
    
    .suggestion-button:hover {
      background-color: rgba(157, 120, 255, 0.2);
      transform: translateY(-2px);
      box-shadow: var(--shadow-primary);
    }
    
    .suggestion-button mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    .loading-message {
      max-width: 120px;
    }
    
    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
    }
    
    .neural-activity {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 14px;
    }
    
    .neural-dot {
      width: 3px;
      height: 100%;
      background-color: var(--primary-600);
      border-radius: 1px;
      display: inline-block;
      animation: neural-activity 1.2s infinite ease-in-out;
      
      &:nth-child(1) { animation-delay: -1.2s; height: 30%; }
      &:nth-child(2) { animation-delay: -1.0s; height: 80%; }
      &:nth-child(3) { animation-delay: -0.8s; height: 60%; }
      &:nth-child(4) { animation-delay: -0.6s; height: 100%; }
      &:nth-child(5) { animation-delay: -0.4s; height: 40%; }
      &:nth-child(6) { animation-delay: -0.2s; height: 70%; }
    }
    
    @keyframes neural-activity {
      0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.4; }
      20% { transform: scaleY(1.0); opacity: 1; }
    }
    
    .assistant-input {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: var(--bg-secondary);
      border-top: var(--border-light);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 20%;
        width: 60%;
        height: 1px;
        background: linear-gradient(
          to right,
          transparent,
          var(--primary-500),
          transparent
        );
      }
    }
    
    .input-field {
      flex: 1;
    }
    
    ::ng-deep .input-field .mat-mdc-text-field-wrapper {
      background-color: var(--bg-tertiary) !important;
    }
    
    ::ng-deep .input-field .mat-mdc-form-field-flex {
      background-color: var(--bg-tertiary) !important;
    }
    
    ::ng-deep .input-field .mdc-text-field--outlined .mdc-floating-label--float-above {
      color: var(--primary-400) !important;
    }
    
    ::ng-deep .input-field .mdc-text-field--outlined .mdc-notched-outline__leading,
    ::ng-deep .input-field .mdc-text-field--outlined .mdc-notched-outline__notch,
    ::ng-deep .input-field .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: var(--primary-400) !important;
      border-width: 1.5px !important;
    }
    
    ::ng-deep .input-field .mat-mdc-form-field-focus-indicator {
      color: var(--primary-500) !important;
    }
    
    ::ng-deep .input-field .mat-mdc-input-element {
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .input-field mat-label {
      color: var(--text-secondary) !important;
    }
    
    ::ng-deep .input-field .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
      color: var(--text-secondary) !important;
    }
    
    .send-button {
      background: var(--gradient-tech);
      color: white;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-primary);
      
      &:hover:not([disabled]) {
        transform: translateY(-2px);
        box-shadow: 0 0 15px var(--primary-500);
        
        .button-glow {
          opacity: 0.6;
        }
      }
      
      .button-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at center,
          rgba(255, 255, 255, 0.8),
          transparent 70%
        );
        opacity: 0.3;
        transition: opacity 0.3s ease;
      }
      
      &[disabled] {
        background: var(--bg-disabled);
        color: var(--text-disabled);
        box-shadow: none;
        
        .button-glow {
          display: none;
        }
      }
    }
    
    .assistant-avatar, .user-avatar {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 4px 8px;
      position: relative;
    }
    
    .assistant-avatar {
      background: linear-gradient(135deg, var(--primary-600), var(--accent-purple));
      color: white;
      box-shadow: var(--shadow-primary);
    }
    
    .user-avatar {
      background: linear-gradient(135deg, var(--secondary-600), var(--accent-info));
      color: white;
      font-weight: 600;
      font-size: 12px;
      box-shadow: var(--shadow-secondary);
    }
    
    .pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid rgba(124, 58, 237, 0.4);
      opacity: 0;
      
      &.animated {
        animation: pulse-animation 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
      }
    }
    
    @keyframes pulse-animation {
      0% {
        transform: scale(0.8);
        opacity: 0.6;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }
    
    .user-pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1px solid var(--secondary-500);
      opacity: 0.4;
    }
    
    /* Accordion styling */
    ::ng-deep .futuristic-accordion .mat-expansion-panel {
      background-color: var(--bg-tertiary) !important;
      color: var(--text-primary) !important;
      border-radius: var(--border-radius) !important;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm) !important;
      border: var(--border-light) !important;
      overflow: hidden;
      position: relative;
    }
    
    ::ng-deep .futuristic-accordion .mat-expansion-panel::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 30%;
      height: 1px;
      background-color: var(--primary-600);
    }
    
    ::ng-deep .futuristic-accordion .mat-expansion-panel-header {
      height: 48px;
      padding: 0 16px;
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .futuristic-accordion .mat-expansion-panel-header-title {
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .futuristic-accordion .mat-content {
      color: var(--text-primary) !important;
    }
    
    .panel-title-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .panel-title-content mat-icon {
      color: var(--primary-600);
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    ::ng-deep .futuristic-accordion .mat-expansion-indicator::after {
      color: var(--primary-600) !important;
    }
    
    .panel-content {
      padding: 8px 0;
    }
    
    .data-item {
      margin-bottom: 16px;
    }
    
    .glitch-divider {
      height: 1px;
      width: 100%;
      background-image: linear-gradient(
        to right, 
        var(--primary-600) 10%, 
        transparent 10%, 
        transparent 20%, 
        var(--primary-600) 20%,
        var(--primary-600) 30%,
        transparent 30%,
        transparent 40%,
        var(--primary-600) 40%,
        var(--primary-600) 60%,
        transparent 60%,
        transparent 70%,
        var(--primary-600) 70%,
        var(--primary-600) 80%,
        transparent 80%,
        transparent 90%,
        var(--primary-600) 90%
      );
      margin: 8px 0;
      opacity: 0.7;
    }
    
    .data-metrics {
      display: flex;
      gap: 24px;
      margin-top: 12px;
    }
    
    .metric {
      position: relative;
      
      .data-label {
        margin-bottom: 2px;
      }
    }
    
    .challenge-type-wrapper {
      position: relative;
      
      .type-indicator {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--secondary-600);
        box-shadow: 0 0 8px var(--secondary-600);
      }
    }
    
    .no-data {
      color: var(--text-tertiary);
      font-style: italic;
    }
    
    .ai-capabilities {
      margin-top: 24px;
      
      h4 {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 12px;
        font-weight: 500;
      }
      
      .capability {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        
        mat-icon {
          color: var(--primary-600);
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
        
        .capability-info {
          flex: 1;
          
          span {
            font-size: 13px;
            display: block;
            margin-bottom: 4px;
            color: var(--text-primary);
          }
          
          .capability-bar {
            height: 4px;
            width: 100%;
            background-color: var(--bg-tertiary);
            border-radius: var(--border-radius-full);
            overflow: hidden;
            
            .bar-fill {
              height: 100%;
              background: var(--gradient-tech);
              border-radius: var(--border-radius-full);
              position: relative;
              
              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  transparent,
                  rgba(255, 255, 255, 0.2),
                  transparent
                );
                animation: bar-shine 2s linear infinite;
              }
            }
          }
        }
      }
    }
    
    @keyframes bar-shine {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    
    a {
      color: var(--secondary-500);
      text-decoration: none;
      position: relative;
      font-weight: 500;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--secondary-500);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }
      
      &:hover {
        text-decoration: none;
        color: var(--secondary-400);
        
        &::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      }
    }
    
    @media (max-width: 768px) {
      .assistant-container {
        width: calc(100% - 32px);
        right: 16px;
        bottom: 16px;
        height: 480px;
      }
      
      .expanded {
        width: calc(100% - 32px);
        height: calc(100% - 120px);
      }
      
      .context-panel {
        display: none;
      }
    }
  `]
})
export class AiAssistantComponent implements OnInit, OnDestroy {
  @Input() currentStep: string = '';
  @Input() contextData: any = {};
  @Input() context: string = '';
  
  isExpanded: boolean = false;
  isMinimized: boolean = false;
  isLoading: boolean = false;
  userQuery: string = '';
  messages: Message[] = [];
  now = new Date();
  
  // Step information map
  private stepInfo: { [key: string]: { name: string, description: string } } = {
    'step1': {
      name: 'Define Problem',
      description: 'Define the problem statement and goals for your innovation challenge.'
    },
    'step2': {
      name: 'Set Audience',
      description: 'Define who can participate and how they register for your challenge.'
    },
    'step3': {
      name: 'Submission Requirements',
      description: 'Define what participants need to submit and in what format.'
    },
    'step4': {
      name: 'Prize Structure',
      description: 'Set up prizes and incentives for challenge participants.'
    },
    'step5': {
      name: 'Timeline',
      description: 'Create the challenge timeline and set important milestones.'
    },
    'step6': {
      name: 'Evaluation Criteria',
      description: 'Establish how submissions will be judged and evaluated.'
    },
    'step7': {
      name: 'Administration',
      description: 'Set up challenge administration and communication channels.'
    }
  };
  
  private destroy$ = new Subject<void>();
  
  constructor(private aiService: AiService) {}
  
  ngOnInit(): void {
    // Any initialization logic here
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get currentStepName(): string {
    return this.stepInfo[this.currentStep]?.name || 'Getting Started';
  }
  
  get currentStepDescription(): string {
    return this.stepInfo[this.currentStep]?.description || 'Start creating your innovation challenge.';
  }
  
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  toggleMinimized(): void {
    this.isMinimized = !this.isMinimized;
    
    // If we're maximizing and it was expanded before, keep it expanded
    if (!this.isMinimized && this.isExpanded) {
      this.isExpanded = true;
    }
  }
  
  submitQuery(): void {
    if (!this.userQuery.trim() || this.isLoading) {
      return;
    }
    
    // Add user message to the conversation
    this.messages.push({
      content: this.userQuery,
      isUser: true,
      timestamp: new Date()
    });
    
    // Prepare context for the AI service
    const context = {
      step: this.currentStep,
      ...this.contextData
    };
    
    // Store query and clear input field
    const query = this.userQuery;
    this.userQuery = '';
    this.isLoading = true;
    
    // Get response from AI service
    const request: AIRequest = {
      prompt: query,
      context: JSON.stringify(context)
    };
    
    this.aiService.getAssistance(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.messages.push({
            content: response.text,
            isUser: false,
            timestamp: new Date()
          });
          this.scrollToBottom();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error getting AI assistance:', error);
          this.messages.push({
            content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
            isUser: false,
            timestamp: new Date()
          });
          this.scrollToBottom();
        }
      });
  }
  
  askSuggestion(suggestion: string): void {
    this.userQuery = suggestion;
    this.submitQuery();
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
  
  formatMessage(content: string): string {
    // Convert URLs to clickable links
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    let formattedContent = content.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
    
    // Convert markdown-style lists to HTML lists
    formattedContent = formattedContent
      .replace(/\n\s*-\s+/g, '\n<br>• ') // Replace "- " with bullet points
      .replace(/\n\s*\d+\.\s+/g, (match) => '\n<br>' + match.trim() + ' '); // Keep numbered lists
    
    // Convert markdown-style bold
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br>
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  }
  
  truncateText(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}