import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AiService } from '../../../core/services/ai.service';

interface Milestone {
  name: string;
  description: string;
  date: Date;
  isRequired: boolean;
}

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="step-container tech-grid">
      <!-- Futuristic AI pattern overlay -->
      <div class="ai-pattern"></div>
      <div class="neural-grid"></div>
      
      <h2 class="neon-text">Set Your Timeline & Milestones</h2>
      <p class="subtitle">Define the timeline and key milestones for your challenge</p>
      
      <div class="timeline-guidance-card">
        <mat-card class="glass-panel">
          <mat-card-header>
            <mat-icon mat-card-avatar>lightbulb</mat-icon>
            <mat-card-title>Timeline Guidance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>An effective timeline should include:</p>
            <ul>
              <li>Registration period (typically 1-2 weeks)</li>
              <li>Q&A/discussion period (throughout challenge)</li>
              <li>Submission deadlines (final and any intermediate)</li>
              <li>Review period (typically 1-2 weeks after submission)</li>
              <li>Winner announcement (at conclusion of review)</li>
            </ul>
            <p *ngIf="challengeType">
              <strong>Recommended duration for {{challengeType}} challenges:</strong> 
              {{getRecommendedDuration()}}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button 
              mat-flat-button 
              class="neon-button"
              (click)="generateSuggestedTimeline()"
              [disabled]="isGenerating">
              <mat-icon>auto_awesome</mat-icon>
              Generate AI Suggested Timeline
            </button>
            <mat-spinner *ngIf="isGenerating" diameter="20"></mat-spinner>
          </mat-card-actions>
        </mat-card>
      </div>

      <form [formGroup]="timelineForm" class="timeline-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Challenge Start Date</mat-label>
            <input 
              matInput 
              [matDatepicker]="startPicker" 
              formControlName="startDate"
              [min]="minStartDate"
              required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error *ngIf="timelineForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Challenge End Date</mat-label>
            <input 
              matInput 
              [matDatepicker]="endPicker" 
              formControlName="endDate"
              [min]="minEndDate"
              required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
            <mat-error *ngIf="timelineForm.get('endDate')?.hasError('required')">
              End date is required
            </mat-error>
            <mat-error *ngIf="timelineForm.get('endDate')?.hasError('endDateInvalid')">
              End date must be after start date
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="duration-display" *ngIf="calculateDuration() > 0">
          <div class="duration-label">Challenge Duration: {{calculateDuration()}} days</div>
          <mat-progress-bar 
            mode="determinate" 
            [value]="getDurationCompleteness()" 
            class="duration-bar">
          </mat-progress-bar>
          <div class="duration-status">{{getDurationStatus()}}</div>
        </div>

        <h3 class="section-title">Challenge Milestones</h3>
        <p class="subtitle">Add key milestones to your timeline</p>
        
        <div class="milestones-container">
          <div class="milestone-item" *ngFor="let milestone of milestones; let i = index">
            <mat-card class="glass-panel">
              <mat-card-content>
                <div class="milestone-header">
                  <div class="milestone-title">
                    <strong>{{milestone.name}}</strong>
                    <mat-chip color="primary" *ngIf="milestone.isRequired" selected>Required</mat-chip>
                  </div>
                  <button 
                    mat-icon-button 
                    color="warn"
                    *ngIf="!milestone.isRequired"
                    (click)="removeMilestone(i)"
                    matTooltip="Remove milestone">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                
                <p class="milestone-description">{{milestone.description}}</p>
                
                <div class="milestone-date">
                  <mat-icon>event</mat-icon>
                  <span>{{milestone.date | date:'MMM d, yyyy'}}</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
          
          <div class="add-milestone">
            <mat-expansion-panel class="glass-panel-expansion">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon>add</mat-icon> Add New Milestone
                </mat-panel-title>
              </mat-expansion-panel-header>
              
              <form [formGroup]="milestoneForm" (ngSubmit)="addMilestone()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Milestone Name</mat-label>
                  <input 
                    matInput 
                    formControlName="name" 
                    placeholder="E.g., Midpoint Review, Prototype Submission"
                    required>
                  <mat-error *ngIf="milestoneForm.get('name')?.hasError('required')">
                    Name is required
                  </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea 
                    matInput 
                    formControlName="description" 
                    rows="3" 
                    placeholder="Describe what participants should do for this milestone"></textarea>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Date</mat-label>
                  <input 
                    matInput 
                    [matDatepicker]="milestonePicker" 
                    formControlName="date"
                    [min]="timelineForm.get('startDate')?.value || minStartDate"
                    [max]="timelineForm.get('endDate')?.value"
                    required>
                  <mat-datepicker-toggle matSuffix [for]="milestonePicker"></mat-datepicker-toggle>
                  <mat-datepicker #milestonePicker></mat-datepicker>
                  <mat-error *ngIf="milestoneForm.get('date')?.hasError('required')">
                    Date is required
                  </mat-error>
                  <mat-error *ngIf="milestoneForm.get('date')?.hasError('milestoneInvalid')">
                    Date must be within challenge timeframe
                  </mat-error>
                </mat-form-field>
                
                <div class="form-actions">
                  <button 
                    mat-flat-button 
                    class="neon-button" 
                    type="submit"
                    [disabled]="milestoneForm.invalid">
                    Add Milestone
                  </button>
                </div>
              </form>
            </mat-expansion-panel>
          </div>
        </div>

        <div class="timeline-validation">
          <mat-card *ngIf="validationIssues.length > 0" class="glass-panel validation-card warning-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="warn">warning</mat-icon>
              <mat-card-title>Timeline Validation Issues</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <ul class="validation-list">
                <li *ngFor="let issue of validationIssues">{{issue}}</li>
              </ul>
            </mat-card-content>
          </mat-card>
          
          <mat-card *ngIf="validationIssues.length === 0 && timelineForm.valid" class="glass-panel validation-card success-card">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">check_circle</mat-icon>
              <mat-card-title>Timeline Configuration Complete</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Your timeline is properly configured with all required milestones.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </form>
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
    
    .form-section {
      margin-bottom: 32px;
      padding: 24px;
      border-radius: var(--border-radius);
      background: var(--bg-card);
      border: var(--border-light);
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    
    .form-section h3 {
      margin-bottom: 16px;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .form-field {
      margin-bottom: 20px;
      width: 48%;
    }
    
    .form-row {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      position: relative;
    }
    
    @media (max-width: 768px) {
      .form-field {
        width: 100%;
      }
    }
    
    .full-width {
      width: 100%;
    }
    
    .timeline-guidance-card {
      margin-bottom: 24px;
      position: relative;
    }
    
    .glass-panel {
      border-radius: var(--border-radius) !important;
      box-shadow: var(--shadow-sm) !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      overflow: hidden;
      background: var(--bg-card) !important;
      border: var(--border-light) !important;
      position: relative;
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
    
    .glass-panel:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-primary) !important;
    }
    
    .glass-panel-expansion {
      border-radius: var(--border-radius) !important;
      background: var(--bg-card) !important;
      border: var(--border-light) !important;
      position: relative;
      overflow: hidden;
    }
    
    .duration-display {
      margin: 20px 0;
      padding: 15px;
      background: var(--bg-tertiary);
      border-radius: var(--border-radius);
      border: var(--border-light);
      position: relative;
    }
    
    .duration-label {
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    
    .duration-bar {
      margin-bottom: 8px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    ::ng-deep .mat-mdc-progress-bar-fill::after {
      background-color: var(--primary-500) !important;
    }
    
    ::ng-deep .mat-mdc-progress-bar-buffer {
      background-color: rgba(var(--primary-rgb), 0.2) !important;
    }
    
    .duration-status {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .milestones-container {
      margin-top: 20px;
      position: relative;
    }
    
    .milestone-item {
      margin-bottom: 16px;
      position: relative;
    }
    
    .milestone-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .milestone-title {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      color: var(--text-primary);
    }
    
    .milestone-description {
      margin-bottom: 8px;
      color: var(--text-secondary);
    }
    
    .milestone-date {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-tertiary);
      font-size: 14px;
    }
    
    .add-milestone {
      margin-top: 16px;
      margin-bottom: 24px;
      position: relative;
    }
    
    .timeline-validation {
      margin-top: 24px;
      position: relative;
    }
    
    .validation-card {
      margin-bottom: 16px;
    }
    
    .warning-card {
      border-left: 4px solid var(--accent-warning) !important;
    }
    
    .success-card {
      border-left: 4px solid var(--accent-success) !important;
    }
    
    .validation-list {
      margin: 0;
      padding: 0 0 0 16px;
      color: var(--text-secondary);
    }
    
    .validation-list li {
      margin-bottom: 8px;
    }
    
    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
    
    .neon-button {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700)) !important;
      color: white !important;
      font-weight: 500 !important;
      border-radius: var(--border-radius) !important;
      box-shadow: var(--shadow-primary) !important;
      transition: all 0.2s ease !important;
      min-height: 36px !important;
      line-height: 36px !important;
      padding: 0 16px !important;
      border: none !important;
    }
    
    .neon-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: var(--shadow-primary), 0 0 15px var(--primary-500) !important;
    }
    
    .neon-button:disabled {
      background: linear-gradient(135deg, var(--disabled-bg), var(--disabled-bg)) !important;
      color: var(--disabled-text) !important;
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
    
    /* Label and input text colors */
    ::ng-deep .mat-form-field-label {
      color: var(--text-secondary) !important;
    }
    
    ::ng-deep .mat-input-element {
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .mat-select-value, ::ng-deep .mat-select-arrow {
      color: var(--text-primary) !important;
    }

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
    
    /* Fix for expansion panel issues with transparency */
    ::ng-deep .mat-expansion-panel {
      margin-bottom: 1rem !important;
      border-radius: 12px !important;
      box-shadow: var(--shadow-sm) !important;
      background-color: var(--bg-tertiary) !important;
      border: var(--border-light) !important;
      overflow: hidden !important;
    }
    
    ::ng-deep .mat-expansion-panel-header {
      height: auto !important;
      padding: 1.2rem 1.5rem !important;
      transition: all 0.3s ease !important;
    }
    
    ::ng-deep .mat-expansion-panel-header:hover {
      background-color: rgba(157, 120, 255, 0.05) !important;
      transform: translateX(5px);
    }
    
    ::ng-deep .mat-expansion-panel-header-title {
      color: var(--text-primary) !important;
      font-weight: 600 !important;
      font-size: 1rem !important;
    }
    
    ::ng-deep .mat-expansion-panel-body {
      padding: 1.2rem 1.5rem !important;
      color: var(--text-secondary) !important;
    }
    
    ::ng-deep .mat-expansion-indicator::after {
      color: var(--primary-600) !important;
    }
    
    /* Fix for dropdown menu transparency issue */
    ::ng-deep .mat-select-panel {
      background: var(--bg-card) !important;
      border-radius: 12px !important;
      box-shadow: var(--shadow-lg) !important;
      overflow: hidden !important;
      margin-top: 8px !important;
      padding: 8px !important;
      border: var(--border-light) !important;
    }
    
    ::ng-deep .mat-option {
      height: 48px !important;
      border-radius: 8px !important;
      margin: 2px 4px !important;
      transition: all 0.2s ease !important;
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .mat-option:hover {
      background: rgba(157, 120, 255, 0.08) !important;
      transform: translateX(3px);
    }
    
    ::ng-deep .mat-option.mat-active,
    ::ng-deep .mat-option.mat-selected:not(.mat-option-disabled) {
      background: rgba(157, 120, 255, 0.12) !important;
      color: var(--primary-600) !important;
    }
    
    /* Datepicker fixes for dark theme */
    ::ng-deep .mat-calendar {
      background-color: var(--bg-card) !important;
    }
    
    ::ng-deep .mat-calendar-body-cell-content {
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .mat-calendar-body-selected {
      background-color: var(--primary-500) !important;
      color: white !important;
    }
    
    ::ng-deep .mat-calendar-arrow {
      border-top-color: var(--text-primary) !important;
    }
    
    ::ng-deep .mat-datepicker-toggle {
      color: var(--text-secondary) !important;
    }
    
    ::ng-deep .mat-datepicker-content {
      background-color: var(--bg-card) !important;
      color: var(--text-primary) !important;
      box-shadow: var(--shadow-lg) !important;
    }
    
    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: var(--primary-300) !important;
    }
    
    ul {
      color: var(--text-secondary);
      margin-left: 1.5rem;
      padding-left: 0;
      position: relative;
    }
    
    ul li {
      margin-bottom: 0.5rem;
      position: relative;
      list-style-type: none;
    }
    
    ul li::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 0.5rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--primary-400);
    }
    
    p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1rem;
      position: relative;
    }
    
    @media (max-width: 768px) {
      .templates-grid {
        grid-template-columns: 1fr;
      }
      
      .editor-toolbar {
        flex-wrap: wrap;
      }
      
      .toolbar-section {
        margin-bottom: 8px;
      }
    }
  `]
})
export class Step5Component implements OnInit {
  timelineForm: FormGroup;
  milestoneForm: FormGroup;
  minStartDate = new Date();
  minEndDate = new Date();
  isGenerating = false;
  challengeType: string | null = null;
  
  milestones: Milestone[] = [];
  validationIssues: string[] = [];
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private snackBar: MatSnackBar
  ) {
    this.timelineForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: this.validateDateRange });
    
    this.milestoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      date: ['', Validators.required]
    }, { validators: this.validateMilestoneDate.bind(this) });
    
    // Set minimum dates to tomorrow
    this.minStartDate.setDate(this.minStartDate.getDate() + 1);
    this.minEndDate.setDate(this.minEndDate.getDate() + 2);
  }
  
  ngOnInit(): void {
    // Retrieve challenge type from state/storage
    // For demo purposes, we'll hard-code a type
    this.challengeType = 'development';
    
    // Listen for changes to dates and update validations
    this.timelineForm.get('startDate')?.valueChanges.subscribe(() => {
      this.validateTimeline();
      this.milestoneForm.get('date')?.updateValueAndValidity();
    });
    
    this.timelineForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateTimeline();
      this.milestoneForm.get('date')?.updateValueAndValidity();
    });
    
    // Set default required milestones based on challenge type
    this.setDefaultMilestones();
  }
  
  validateDateRange(group: FormGroup): {[key: string]: boolean} | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (start && end && new Date(end) <= new Date(start)) {
      return { 'endDateInvalid': true };
    }
    
    return null;
  }
  
  validateMilestoneDate(group: FormGroup): {[key: string]: boolean} | null {
    const date = group.get('date')?.value;
    const startDate = this.timelineForm.get('startDate')?.value;
    const endDate = this.timelineForm.get('endDate')?.value;
    
    if (date && startDate && endDate) {
      const milestoneDate = new Date(date);
      if (milestoneDate < new Date(startDate) || milestoneDate > new Date(endDate)) {
        return { 'milestoneInvalid': true };
      }
    }
    
    return null;
  }
  
  setDefaultMilestones(): void {
    // Clear existing milestones
    this.milestones = [];
    
    // Start with required milestones
    const startDate = this.timelineForm.get('startDate')?.value;
    const endDate = this.timelineForm.get('endDate')?.value;
    
    // Example default milestones - in a real app these would be dynamic based on challenge type
    if (startDate && endDate) {
      // Convert to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // Registration close date (usually 1/3 of the way through)
      const registrationClose = new Date(start);
      registrationClose.setDate(start.getDate() + Math.floor(duration / 3));
      
      // Submission deadline (end date)
      const submissionDeadline = new Date(end);
      
      this.milestones = [
        {
          name: 'Registration Closes',
          description: 'Last day for participants to register for the challenge.',
          date: registrationClose,
          isRequired: true
        },
        {
          name: 'Final Submission Deadline',
          description: 'All submissions must be completed by this deadline.',
          date: submissionDeadline,
          isRequired: true
        }
      ];
    }
  }
  
  calculateDuration(): number {
    const startDate = this.timelineForm.get('startDate')?.value;
    const endDate = this.timelineForm.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    return 0;
  }
  
  getDurationCompleteness(): number {
    const duration = this.calculateDuration();
    const recommendedMin = this.getRecommendedMinDuration();
    const recommendedMax = this.getRecommendedMaxDuration();
    
    if (duration < recommendedMin) {
      return (duration / recommendedMin) * 100;
    } else if (duration <= recommendedMax) {
      return 100;
    } else {
      // Over the recommended max, but we'll cap at 100%
      return 100;
    }
  }
  
  getDurationStatus(): string {
    const duration = this.calculateDuration();
    const recommendedMin = this.getRecommendedMinDuration();
    const recommendedMax = this.getRecommendedMaxDuration();
    
    if (duration < recommendedMin) {
      return `Your challenge duration is shorter than recommended (${recommendedMin}-${recommendedMax} days)`;
    } else if (duration <= recommendedMax) {
      return `Your challenge duration is within the recommended range (${recommendedMin}-${recommendedMax} days)`;
    } else {
      return `Your challenge duration is longer than recommended (${recommendedMin}-${recommendedMax} days)`;
    }
  }
  
  getRecommendedDuration(): string {
    return `${this.getRecommendedMinDuration()}-${this.getRecommendedMaxDuration()} days`;
  }
  
  getRecommendedMinDuration(): number {
    switch (this.challengeType) {
      case 'ideation':
        return 14;  // 2 weeks
      case 'design':
        return 21;  // 3 weeks
      case 'development':
        return 42;  // 6 weeks
      case 'data-science':
        return 28;  // 4 weeks
      case 'ai':
        return 42;  // 6 weeks
      case 'research':
        return 56;  // 8 weeks
      default:
        return 28;  // 4 weeks default
    }
  }
  
  getRecommendedMaxDuration(): number {
    switch (this.challengeType) {
      case 'ideation':
        return 28;  // 4 weeks
      case 'design':
        return 42;  // 6 weeks
      case 'development':
        return 84;  // 12 weeks
      case 'data-science':
        return 56;  // 8 weeks
      case 'ai':
        return 84;  // 12 weeks
      case 'research':
        return 112; // 16 weeks
      default:
        return 56;  // 8 weeks default
    }
  }
  
  validateTimeline(): void {
    this.validationIssues = [];
    
    const duration = this.calculateDuration();
    const recommendedMin = this.getRecommendedMinDuration();
    
    if (duration < 7) {
      this.validationIssues.push('Challenge duration is less than 7 days, which is generally too short.');
    } else if (duration < recommendedMin) {
      this.validationIssues.push(`Challenge duration is shorter than the recommended minimum (${recommendedMin} days) for ${this.challengeType} challenges.`);
    }
    
    // Check if we have the required milestones
    const hasRegistrationClose = this.milestones.some(m => 
      m.name.toLowerCase().includes('registration') && m.name.toLowerCase().includes('close'));
      
    const hasSubmissionDeadline = this.milestones.some(m => 
      m.name.toLowerCase().includes('submission') && m.name.toLowerCase().includes('deadline'));
    
    if (!hasRegistrationClose) {
      this.validationIssues.push('Missing a registration closing milestone.');
    }
    
    if (!hasSubmissionDeadline) {
      this.validationIssues.push('Missing a submission deadline milestone.');
    }
  }
  
  addMilestone(): void {
    if (this.milestoneForm.invalid) {
      return;
    }
    
    const newMilestone: Milestone = {
      name: this.milestoneForm.get('name')?.value,
      description: this.milestoneForm.get('description')?.value || 
                  `Milestone for ${this.milestoneForm.get('name')?.value}`,
      date: new Date(this.milestoneForm.get('date')?.value),
      isRequired: false
    };
    
    this.milestones.push(newMilestone);
    
    // Sort milestones by date
    this.milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Reset form
    this.milestoneForm.reset();
    
    // Validate timeline
    this.validateTimeline();
  }
  
  removeMilestone(index: number): void {
    if (this.milestones[index] && !this.milestones[index].isRequired) {
      this.milestones.splice(index, 1);
      this.validateTimeline();
    }
  }
  
  generateSuggestedTimeline(): void {
    const startDate = this.timelineForm.get('startDate')?.value;
    const endDate = this.timelineForm.get('endDate')?.value;
    
    if (!startDate || !endDate) {
      this.snackBar.open('Please set start and end dates first', 'Close', { duration: 3000 });
      return;
    }
    
    this.isGenerating = true;
    
    // Gather challenge information to provide context for the AI
    const challengeDetails = {
      type: this.challengeType,
      startDate: startDate,
      endDate: endDate,
      duration: this.calculateDuration()
    };
    
    // Call AI service to get timeline suggestions
    this.aiService.getTimelineSuggestions(challengeDetails).subscribe({
      next: (response) => {
        if (response.success && response.suggestions?.length > 0) {
          // Clear existing non-required milestones
          this.milestones = this.milestones.filter(m => m.isRequired);
          
          // Add suggested milestones
          response.suggestions.forEach((suggestion: any) => {
            if (suggestion.name && suggestion.date) {
              this.milestones.push({
                name: suggestion.name,
                description: suggestion.description || `${suggestion.name} milestone`,
                date: new Date(suggestion.date),
                isRequired: false
              });
            }
          });
          
          // Sort milestones by date
          this.milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
          
          this.snackBar.open('Timeline suggestions added!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Could not generate timeline suggestions. Please try again.', 'Close', { duration: 3000 });
        }
        this.isGenerating = false;
      },
      error: () => {
        this.snackBar.open('Error generating timeline suggestions', 'Close', { duration: 3000 });
        this.isGenerating = false;
      }
    });
  }
}