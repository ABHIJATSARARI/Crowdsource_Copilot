import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-step7',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ],
  template: `
    <div class="step-container tech-grid">
      <!-- Futuristic AI pattern overlay -->
      <div class="ai-pattern"></div>
      <div class="neural-grid"></div>
      
      <h2 class="neon-text">Review & Launch Challenge</h2>
      <p class="subtitle">Finalize details and make your challenge live</p>

      <div class="launch-status-container glass-panel">
        <div class="completion-section">
          <h3>Challenge Readiness: {{completionPercentage}}% Complete</h3>
          <mat-progress-bar 
            class="completion-progress" 
            [color]="completionPercentage >= 80 ? 'primary' : 'warn'"
            [value]="completionPercentage">
          </mat-progress-bar>
          
          <div class="readiness-status">
            <div class="status-indicator" [ngClass]="{'status-ready': isReadyToLaunch, 'status-notready': !isReadyToLaunch}">
              <mat-icon>{{isReadyToLaunch ? 'check_circle' : 'error'}}</mat-icon>
              <span>{{isReadyToLaunch ? 'Ready to launch' : 'Missing required information'}}</span>
            </div>
          </div>
        </div>
        
        <div class="divider-container">
          <mat-divider></mat-divider>
        </div>
        
        <div class="requirements-section">
          <h3>Requirements Checklist</h3>
          <div class="requirement-list">
            <div *ngFor="let req of requirementsList" 
                 class="requirement-item"
                 [ngClass]="{'completed': req.complete, 'incomplete': !req.complete}">
              <mat-icon>{{req.complete ? 'check_circle' : 'radio_button_unchecked'}}</mat-icon>
              <div class="requirement-details">
                <span class="requirement-name">{{req.name}}</span>
                <span class="requirement-status">{{req.status}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="challenge-preview-container">
        <h3 class="section-title">Challenge Preview</h3>
        
        <div class="preview-card glass-panel">
          <div class="preview-header">
            <div class="challenge-title-container">
              <h4 class="challenge-title">{{challengeTitle || 'Your Challenge Title'}}</h4>
              <div class="challenge-badges">
                <mat-chip class="reward-chip">
                  <mat-icon>attach_money</mat-icon> {{totalPrize | currency:'USD':'symbol':'1.0-0'}}
                </mat-chip>
                <mat-chip class="timeframe-chip">
                  <mat-icon>schedule</mat-icon> {{challengeDuration}} days
                </mat-chip>
                <mat-chip class="category-chip">
                  <mat-icon>category</mat-icon> {{challengeCategory || 'Category'}}
                </mat-chip>
              </div>
            </div>
            
            <div class="challenge-image">
              <div class="image-placeholder" *ngIf="!challengeImageUrl">
                <mat-icon>image</mat-icon>
              </div>
              <img *ngIf="challengeImageUrl" [src]="challengeImageUrl" alt="Challenge image">
            </div>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="preview-body">
            <div class="summary-section">
              <h5>Challenge Summary</h5>
              <p>{{challengeSummary || 'No summary provided yet.'}}</p>
            </div>
            
            <div class="dates-section">
              <div class="date-item">
                <div class="date-label">Start Date</div>
                <div class="date-value">{{startDate | date:'MMM d, y'}}</div>
              </div>
              <div class="date-item">
                <div class="date-label">Submission Deadline</div>
                <div class="date-value">{{endDate | date:'MMM d, y'}}</div>
              </div>
            </div>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="preview-footer">
            <div class="tags-section">
              <h5>Tags</h5>
              <div class="tags-list">
                <mat-chip *ngFor="let tag of challengeTags">
                  {{tag}}
                </mat-chip>
                <span *ngIf="challengeTags?.length === 0" class="no-tags">No tags added</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="launch-options-container glass-panel">
        <h3>Launch Options</h3>
        
        <form [formGroup]="launchForm">
          <div class="form-section">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Schedule Launch Date</mat-label>
              <input 
                matInput 
                [matDatepicker]="launchDatePicker"
                formControlName="launchDate">
              <mat-hint>Leave blank to launch immediately</mat-hint>
              <mat-datepicker-toggle matSuffix [for]="launchDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #launchDatePicker></mat-datepicker>
            </mat-form-field>
            
            <div class="visibility-options">
              <h5>Challenge Visibility</h5>
              <mat-radio-group formControlName="visibility" class="visibility-radio">
                <div class="radio-option">
                  <mat-radio-button value="public">
                    <div class="radio-content">
                      <div class="radio-label">Public</div>
                      <div class="radio-description">Visible to all users on the platform</div>
                    </div>
                  </mat-radio-button>
                </div>
                
                <div class="radio-option">
                  <mat-radio-button value="private">
                    <div class="radio-content">
                      <div class="radio-label">Private (Invitation Only)</div>
                      <div class="radio-description">Only visible to users you invite</div>
                    </div>
                  </mat-radio-button>
                </div>
                
                <div class="radio-option">
                  <mat-radio-button value="organization">
                    <div class="radio-content">
                      <div class="radio-label">Organization Only</div>
                      <div class="radio-description">Visible only to members of your organization</div>
                    </div>
                  </mat-radio-button>
                </div>
              </mat-radio-group>
            </div>
            
            <div class="notification-options">
              <h5>Notifications</h5>
              <div class="notification-option">
                <mat-slide-toggle formControlName="notifyTeam" color="primary">
                  Notify team members
                </mat-slide-toggle>
              </div>
              <div class="notification-option">
                <mat-slide-toggle formControlName="notifyFollowers" color="primary">
                  Notify followers of your organization
                </mat-slide-toggle>
              </div>
              <div class="notification-option">
                <mat-slide-toggle formControlName="sendEmail" color="primary">
                  Send email announcement
                </mat-slide-toggle>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="action-buttons">
        <button 
          mat-flat-button 
          color="accent" 
          class="neon-button save-draft"
          (click)="saveDraft()">
          Save as Draft
        </button>
        
        <button 
          mat-flat-button 
          color="primary" 
          class="neon-button launch"
          [disabled]="!isReadyToLaunch || isLaunching"
          (click)="launchChallenge()">
          <mat-icon>rocket_launch</mat-icon>
          {{isLaunching ? 'Launching...' : 'Launch Challenge'}}
        </button>
        <mat-spinner *ngIf="isLaunching" diameter="20"></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .step-container {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: 32px;
      position: relative;
    }
    
    /* AI-inspired visual elements */
    .ai-pattern {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      opacity: 0.03;
      z-index: 0;
      background-image: 
        repeating-radial-gradient(circle at 25% 25%, transparent 0, rgba(157, 120, 255, 1) 40px),
        repeating-radial-gradient(circle at 75% 75%, transparent 0, rgba(92, 225, 230, 1) 40px);
      mix-blend-mode: overlay;
      filter: blur(50px);
    }

    .neural-grid {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
      opacity: 0.03;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
    }
    
    h2 {
      color: var(--text-primary);
      margin-bottom: 8px;
      font-size: 1.7rem;
      font-weight: 600;
      text-align: center;
      position: relative;
    }
    
    .neon-text {
      background: linear-gradient(90deg, var(--primary-600), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
    }
    
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 24px;
      text-align: center;
      position: relative;
    }
    
    .section-title {
      color: var(--text-primary);
      margin: 32px 0 8px;
      font-size: 1.3rem;
      font-weight: 500;
      position: relative;
      text-align: center;
    }
    
    .glass-panel {
      border-radius: var(--border-radius) !important;
      box-shadow: var(--shadow-sm) !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      overflow: hidden;
      background: var(--bg-card) !important;
      border: var(--border-light) !important;
      position: relative;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .glass-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(157, 120, 255, 0.02),
        rgba(92, 225, 230, 0.01)
      );
      z-index: 0;
    }
    
    /* Completion & Launch Status */
    .completion-section {
      margin-bottom: 24px;
      position: relative;
    }
    
    .completion-section h3 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .completion-progress {
      height: 8px !important;
      border-radius: 4px !important;
      margin-bottom: 16px !important;
      background-color: var(--bg-tertiary) !important;
    }
    
    ::ng-deep .mat-mdc-progress-bar {
      --mdc-linear-progress-active-indicator-color: var(--primary-500) !important;
      --mdc-linear-progress-track-color: var(--bg-tertiary) !important;
      background-color: var(--bg-tertiary) !important;
    }
    
    ::ng-deep .mat-warn {
      --mdc-linear-progress-active-indicator-color: var(--accent-warning) !important;
    }
    
    .readiness-status {
      display: flex;
      margin-top: 8px;
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    
    .status-ready {
      color: var(--accent-success);
    }
    
    .status-notready {
      color: var(--accent-warning);
    }
    
    .divider-container {
      margin: 24px 0;
    }
    
    /* Requirements Section */
    .requirements-section h3 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .requirement-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    @media (max-width: 640px) {
      .requirement-list {
        grid-template-columns: 1fr;
      }
    }
    
    .requirement-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px;
      border-radius: var(--border-radius);
      background: var(--bg-tertiary);
      transition: all 0.2s ease;
    }
    
    .requirement-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    
    .completed {
      border-left: 4px solid var(--accent-success);
    }
    
    .completed mat-icon {
      color: var(--accent-success);
    }
    
    .incomplete {
      border-left: 4px solid var(--accent-warning);
    }
    
    .requirement-details {
      display: flex;
      flex-direction: column;
    }
    
    .requirement-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .requirement-status {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    
    /* Challenge Preview */
    .challenge-preview-container {
      margin-bottom: 24px;
    }
    
    .preview-card {
      padding: 0 !important;
      overflow: hidden;
    }
    
    .preview-header {
      display: flex;
      padding: 24px;
      justify-content: space-between;
      align-items: flex-start;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-rgb), 0.05),
        rgba(var(--accent-purple-rgb), 0.02)
      );
    }
    
    .challenge-title-container {
      flex: 1;
    }
    
    .challenge-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0 0 16px;
      color: var(--text-primary);
    }
    
    .challenge-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .reward-chip {
      background-color: var(--accent-money) !important;
      color: white !important;
    }
    
    .timeframe-chip {
      background-color: var(--accent-info) !important;
      color: white !important;
    }
    
    .category-chip {
      background-color: var(--accent-purple) !important;
      color: white !important;
    }
    
    ::ng-deep .mat-mdc-chip {
      padding: 4px 8px !important;
      background-color: var(--bg-card) !important;
      color: var(--text-primary) !important;
    }
    
    .challenge-image {
      width: 120px;
      height: 120px;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      border: var(--border-light);
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .image-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--text-tertiary);
    }
    
    .challenge-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .preview-body {
      padding: 24px;
    }
    
    .summary-section {
      margin-bottom: 24px;
    }
    
    .summary-section h5 {
      margin: 0 0 8px;
      font-weight: 500;
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .summary-section p {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }
    
    .dates-section {
      display: flex;
      gap: 24px;
    }
    
    .date-item {
      flex: 1;
    }
    
    .date-label {
      font-size: 0.9rem;
      color: var(--text-tertiary);
      margin-bottom: 4px;
    }
    
    .date-value {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .preview-footer {
      padding: 24px;
    }
    
    .tags-section h5 {
      margin: 0 0 12px;
      font-weight: 500;
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .no-tags {
      font-style: italic;
      color: var(--text-tertiary);
    }
    
    /* Launch Options */
    .form-section {
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    h5 {
      margin: 16px 0 12px;
      font-weight: 500;
      font-size: 1rem;
      color: var(--text-primary);
    }
    
    .visibility-radio {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .radio-option {
      background-color: var(--bg-tertiary);
      border-radius: var(--border-radius);
      padding: 12px 16px;
      transition: all 0.2s ease;
      border: var(--border-light);
    }
    
    .radio-option:hover {
      background-color: rgba(var(--primary-rgb), 0.05);
    }
    
    .radio-content {
      margin-left: 8px;
      flex: 1;
    }
    
    .radio-label {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .radio-description {
      font-size: 0.85rem;
      color: var(--text-tertiary);
      margin-top: 4px;
    }
    
    ::ng-deep .mat-mdc-radio-button {
      --mdc-radio-selected-focus-icon-color: var(--primary-500) !important;
      --mdc-radio-selected-hover-icon-color: var(--primary-500) !important;
      --mdc-radio-selected-icon-color: var(--primary-500) !important;
      --mdc-radio-selected-pressed-icon-color: var(--primary-700) !important;
      --mat-mdc-radio-checked-ripple-color: var(--primary-500) !important;
    }
    
    .notification-options {
      margin-top: 24px;
    }
    
    .notification-option {
      margin-bottom: 16px;
    }
    
    ::ng-deep .mdc-switch:enabled .mdc-switch__track::after {
      background: var(--primary-500) !important;
    }
    
    ::ng-deep .mdc-switch:enabled .mdc-switch__handle::after {
      background: white !important;
    }
    
    ::ng-deep .mdc-switch:enabled:hover .mdc-switch__track::after {
      background: var(--primary-600) !important;
    }
    
    /* Action buttons */
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 32px;
      position: relative;
    }
    
    .neon-button {
      font-weight: 500 !important;
      border-radius: var(--border-radius) !important;
      min-height: 44px !important;
      min-width: 160px !important;
      box-shadow: var(--shadow-primary) !important;
      transition: all 0.2s ease !important;
    }
    
    .save-draft {
      background-color: var(--accent-info) !important;
      color: white !important;
    }
    
    .launch {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700)) !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
    }
    
    .neon-button:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: var(--shadow-primary), 0 0 15px rgba(var(--primary-rgb), 0.3) !important;
    }
    
    .neon-button:disabled {
      background: linear-gradient(135deg, var(--disabled-bg), var(--disabled-bg)) !important;
      color: var(--disabled-text) !important;
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
    
    /* Material form field customizations */
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: auto !important;
    }

    ::ng-deep .mat-mdc-form-field-hint {
      color: var(--text-secondary) !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: var(--bg-input) !important;
    }

    ::ng-deep .mat-mdc-form-field-focus-overlay {
      background-color: rgba(var(--primary-rgb), 0.05) !important; 
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label, 
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label--float-above {
      color: var(--text-secondary) !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
      color: var(--text-primary) !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: var(--border-light) !important;
    }

    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__trailing {
      border-color: var(--primary-400) !important;
    }
    
    ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: var(--primary-500) !important;
      border-width: 2px !important;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
      .preview-header {
        flex-direction: column;
        gap: 16px;
      }
      
      .challenge-image {
        width: 100%;
        height: 160px;
      }
      
      .dates-section {
        flex-direction: column;
        gap: 16px;
      }
      
      .requirement-list {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .neon-button {
        width: 100%;
      }
    }
  `]
})
export class Step7Component implements OnInit {
  // Challenge completion status
  completionPercentage = 85;
  isReadyToLaunch = false;
  isLaunching = false;
  
  // Challenge details
  challengeTitle = 'AI-Powered Code Analyzer';
  totalPrize = 5000;
  challengeDuration = 30;
  challengeCategory = 'Software Development';
  challengeImageUrl = '';
  challengeSummary = 'Create an AI tool that can analyze code for security vulnerabilities, performance issues, and best practices.';
  startDate = new Date();
  endDate = new Date(new Date().setDate(new Date().getDate() + 30));
  challengeTags: string[] = ['AI', 'Machine Learning', 'Security', 'Code Analysis'];
  
  // Form control
  launchForm: FormGroup;
  
  // Requirements checklist
  requirementsList = [
    {
      name: 'Basic Information',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Description & Requirements',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Prize Structure',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Timeline',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Submission Guidelines',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Evaluation Criteria',
      status: 'Complete',
      complete: true
    },
    {
      name: 'Legal Terms',
      status: '2 items missing',
      complete: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private aiService: AiService
  ) {
    // Initialize launch form
    this.launchForm = this.fb.group({
      launchDate: [null],
      visibility: ['public', Validators.required],
      notifyTeam: [true],
      notifyFollowers: [true],
      sendEmail: [false]
    });
  }

  ngOnInit(): void {
    // Calculate completion status
    this.calculateCompletionStatus();
  }
  
  // Calculate the completion percentage and ready-to-launch status
  private calculateCompletionStatus(): void {
    const completedRequirements = this.requirementsList.filter(req => req.complete).length;
    const totalRequirements = this.requirementsList.length;
    
    this.completionPercentage = Math.round((completedRequirements / totalRequirements) * 100);
    this.isReadyToLaunch = this.completionPercentage >= 90;
  }

  // Save the challenge as a draft
  saveDraft(): void {
    this.snackBar.open('Challenge saved as draft', 'Close', {
      duration: 3000,
      panelClass: 'success-snackbar'
    });
  }

  // Launch the challenge
  launchChallenge(): void {
    if (!this.isReadyToLaunch) {
      this.snackBar.open('Please complete all required information before launching', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }
    
    this.isLaunching = true;
    
    // Simulate challenge launch process
    setTimeout(() => {
      this.isLaunching = false;
      
      this.snackBar.open('Challenge launched successfully! 🚀', 'Close', {
        duration: 5000,
        panelClass: 'success-snackbar'
      });
      
      // Navigate to dashboard or challenge page
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }, 2500);
  }
}