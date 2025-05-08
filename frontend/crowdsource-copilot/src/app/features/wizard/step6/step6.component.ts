import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { AiService } from '../../../core/services/ai.service';

interface EvaluationCriterion {
  name: string;
  description: string;
  weight: number;
  scoreType: 'numeric' | 'percentage' | 'scale';
  maxScore: number;
  required: boolean;
}

@Component({
  selector: 'app-step6',
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
    MatSliderModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <div class="step-container tech-grid">
      <!-- Futuristic AI pattern overlay -->
      <div class="ai-pattern"></div>
      <div class="neural-grid"></div>
      
      <h2 class="neon-text">Define Evaluation Criteria</h2>
      <p class="subtitle">Set up how submissions will be evaluated and scored</p>
      
      <div class="evaluation-guidance-card">
        <mat-card class="glass-panel">
          <mat-card-header>
            <mat-icon mat-card-avatar>grading</mat-icon>
            <mat-card-title>Evaluation Best Practices</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Strong evaluation criteria should:</p>
            <ul>
              <li>Be clear, specific, and measurable</li>
              <li>Align with the challenge goals</li>
              <li>Include both technical and business considerations</li>
              <li>Have appropriate weights that reflect priorities</li>
              <li>Be fair and transparent to all participants</li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button 
              mat-flat-button 
              class="neon-button"
              (click)="suggestCriteria()"
              [disabled]="isGenerating">
              <mat-icon>psychology</mat-icon>
              Suggest Criteria with AI
            </button>
            <mat-spinner *ngIf="isGenerating" diameter="20"></mat-spinner>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="scoring-config-section glass-panel">
        <h3 class="section-title">Scoring Configuration</h3>
        
        <form [formGroup]="scoringForm">
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Scoring Method</mat-label>
              <mat-select formControlName="scoringMethod">
                <mat-option value="weighted">Weighted Average</mat-option>
                <mat-option value="additive">Additive Scoring</mat-option>
                <mat-option value="threshold">Threshold Scoring</mat-option>
              </mat-select>
              <mat-hint>How individual criteria scores will be combined</mat-hint>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Minimum Score to Qualify</mat-label>
              <input 
                matInput 
                type="number" 
                formControlName="qualificationThreshold"
                min="0"
                max="100">
              <mat-hint>Minimum percentage score to be considered for prizes</mat-hint>
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Number of Required Reviewers</mat-label>
              <input 
                matInput 
                type="number" 
                formControlName="requiredReviewers"
                min="1"
                max="10">
              <mat-hint>How many people must review each submission</mat-hint>
            </mat-form-field>
            
            <div class="checkbox-field form-field">
              <mat-checkbox formControlName="allowSelfAssessment" color="primary">
                Allow participant self-assessment
              </mat-checkbox>
              <div class="checkbox-hint">Enable participants to score themselves as part of the process</div>
            </div>
          </div>
        </form>
      </div>

      <h3 class="section-title">Evaluation Criteria</h3>
      <p class="subtitle">Define the criteria that will be used to evaluate submissions</p>
      
      <div class="weight-distribution" *ngIf="totalWeight !== 100">
        <div [ngClass]="{'weight-warning': totalWeight !== 100, 'weight-valid': totalWeight === 100}">
          <mat-icon>{{totalWeight === 100 ? 'check_circle' : 'warning'}}</mat-icon>
          <span>Total weight: {{totalWeight}}% (should equal 100%)</span>
        </div>
      </div>

      <div class="criteria-list">
        <form [formGroup]="criteriaForm">
          <div formArrayName="criteria">
            <div *ngFor="let criterion of criteriaControls.controls; let i = index" class="criterion-item">
              <mat-card class="glass-panel">
                <div [formGroupName]="i">
                  <div class="criterion-header">
                    <div class="criterion-title-section">
                      <mat-form-field appearance="outline">
                        <mat-label>Criterion Name</mat-label>
                        <input 
                          matInput 
                          formControlName="name" 
                          placeholder="E.g., Technical Execution, Innovation"
                          required>
                        <mat-error *ngIf="criterion.get('name')?.hasError('required')">
                          Name is required
                        </mat-error>
                      </mat-form-field>
                      <div class="required-chip" *ngIf="criterion.get('required')?.value">
                        <mat-chip color="primary" selected>Required</mat-chip>
                      </div>
                    </div>
                    
                    <button 
                      mat-icon-button 
                      color="warn" 
                      type="button"
                      *ngIf="!criterion.get('required')?.value"
                      (click)="removeCriterion(i)"
                      matTooltip="Remove criterion">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea 
                      matInput 
                      formControlName="description" 
                      rows="2" 
                      placeholder="Explain what this criterion measures and how it will be evaluated"></textarea>
                  </mat-form-field>
                  
                  <div class="criterion-details-row">
                    <mat-form-field appearance="outline" class="weight-field">
                      <mat-label>Weight (%)</mat-label>
                      <input 
                        matInput 
                        type="number" 
                        formControlName="weight"
                        min="1"
                        max="100"
                        required>
                      <mat-error *ngIf="criterion.get('weight')?.hasError('required')">
                        Weight is required
                      </mat-error>
                      <mat-error *ngIf="criterion.get('weight')?.hasError('min')">
                        Must be at least 1%
                      </mat-error>
                      <mat-error *ngIf="criterion.get('weight')?.hasError('max')">
                        Cannot exceed 100%
                      </mat-error>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Score Type</mat-label>
                      <mat-select formControlName="scoreType" required>
                        <mat-option value="numeric">Numeric (e.g., 1-10)</mat-option>
                        <mat-option value="percentage">Percentage (0-100%)</mat-option>
                        <mat-option value="scale">Scale (e.g., Poor to Excellent)</mat-option>
                      </mat-select>
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline" *ngIf="criterion.get('scoreType')?.value === 'numeric'">
                      <mat-label>Max Score</mat-label>
                      <input 
                        matInput 
                        type="number" 
                        formControlName="maxScore"
                        min="1"
                        max="100">
                    </mat-form-field>
                  </div>
                </div>
              </mat-card>
            </div>
          </div>
        </form>
        
        <div class="add-criterion">
          <button 
            mat-flat-button 
            class="neon-button" 
            (click)="addCriterion()">
            <mat-icon>add</mat-icon> Add Criterion
          </button>
        </div>
      </div>

      <div class="example-section">
        <mat-expansion-panel class="glass-panel-expansion">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>auto_awesome</mat-icon>
              Example Criteria
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <div class="example-content">
            <h4>Sample Criteria for a {{challengeType || 'Software'}} Challenge</h4>
            
            <div class="example-criterion" *ngFor="let example of exampleCriteria">
              <h5>{{example.name}} ({{example.weight}}%)</h5>
              <p>{{example.description}}</p>
            </div>
          </div>
        </mat-expansion-panel>
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
    
    .scoring-config-section {
      margin-bottom: 32px;
      padding: 24px;
      border-radius: var(--border-radius);
      background: var(--bg-card);
      border: var(--border-light);
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    
    .form-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      position: relative;
      flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }
    }
    
    .form-field {
      flex: 1;
      min-width: 200px;
    }
    
    .checkbox-field {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 12px;
      margin-top: 12px;
    }
    
    .checkbox-hint {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
    }
    
    .weight-distribution {
      background-color: var(--bg-tertiary);
      padding: 12px 16px;
      border-radius: var(--border-radius);
      margin-bottom: 16px;
      border: var(--border-light);
      position: relative;
    }
    
    .weight-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-warning);
    }
    
    .weight-valid {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-success);
    }
    
    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      position: relative;
    }
    
    .criterion-item {
      margin-bottom: 16px;
      position: relative;
    }
    
    .criterion-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .criterion-title-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      flex-wrap: wrap;
    }
    
    .required-chip {
      margin-top: 8px;
    }
    
    .criterion-details-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .weight-field {
      width: 100px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .add-criterion {
      display: flex;
      justify-content: center;
      margin: 16px 0;
    }
    
    .example-content {
      padding: 8px;
    }
    
    .example-criterion {
      margin-bottom: 16px;
    }
    
    .example-criterion h5 {
      margin-bottom: 4px;
      color: var(--text-primary);
    }
    
    .example-criterion p {
      margin-top: 0;
      color: var(--text-secondary);
    }
    
    /* Glass panel theming */
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
    
    h4 {
      color: var(--text-primary);
      margin: 16px 0 8px;
      font-size: 1.1rem;
      font-weight: 500;
      position: relative;
    }
    
    /* Form Actions */
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
    
    /* Material checkbox styling */
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: var(--primary-500) !important;
      border-color: var(--primary-500) !important;
    }
    
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled ~ .mdc-checkbox__background {
      border-color: var(--text-tertiary) !important;
    }
    
    @media (max-width: 768px) {
      .form-field {
        width: 100%;
      }
      
      .criterion-details-row {
        flex-direction: column;
      }
      
      .weight-field {
        width: 100%;
      }
    }
  `]
})
export class Step6Component implements OnInit {
  scoringForm: FormGroup;
  criteriaForm: FormGroup;
  isGenerating = false;
  totalWeight = 0;
  challengeType: string = 'Software';
  
  exampleCriteria = [
    {
      name: 'Technical Innovation',
      weight: 25,
      description: 'Evaluates the technical novelty and creativity of the solution, including uniqueness of approach and technological advancement.'
    },
    {
      name: 'Performance & Efficiency',
      weight: 20,
      description: 'Measures how well the solution performs in terms of speed, resource usage, and overall efficiency.'
    },
    {
      name: 'Code Quality',
      weight: 20,
      description: 'Evaluates the quality of code, including readability, organization, documentation, and adherence to best practices.'
    },
    {
      name: 'User Experience',
      weight: 15,
      description: 'Measures how intuitive, accessible, and enjoyable the solution is for end users.'
    },
    {
      name: 'Practicality & Impact',
      weight: 20,
      description: 'Evaluates the practical application and potential real-world impact of the solution.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private snackBar: MatSnackBar
  ) {
    // Initialize the scoring form
    this.scoringForm = this.fb.group({
      scoringMethod: ['weighted', Validators.required],
      qualificationThreshold: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      requiredReviewers: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      allowSelfAssessment: [false]
    });

    // Initialize the criteria form with FormArray
    this.criteriaForm = this.fb.group({
      criteria: this.fb.array([])
    });

    // Add default criteria
    this.addDefaultCriteria();
  }

  ngOnInit(): void {
    // Subscribe to criteria changes to update total weight
    this.criteriaControls.valueChanges.subscribe(() => {
      this.calculateTotalWeight();
    });
  }

  // Getter for the criteria FormArray
  get criteriaControls(): FormArray {
    return this.criteriaForm.get('criteria') as FormArray;
  }

  // Add a new criterion
  addCriterion(): void {
    const criterion = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      weight: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      scoreType: ['numeric', Validators.required],
      maxScore: [10],
      required: [false]
    });

    this.criteriaControls.push(criterion);
    this.calculateTotalWeight();
  }

  // Remove a criterion
  removeCriterion(index: number): void {
    this.criteriaControls.removeAt(index);
    this.calculateTotalWeight();
  }

  // Calculate the total weight of all criteria
  calculateTotalWeight(): void {
    this.totalWeight = this.criteriaControls.controls.reduce((sum, control) => {
      return sum + control.get('weight')?.value || 0;
    }, 0);
  }

  // Add default criteria
  addDefaultCriteria(): void {
    const defaultCriteria = [
      {
        name: 'Technical Execution',
        description: 'How well the solution is technically implemented',
        weight: 30,
        scoreType: 'numeric',
        maxScore: 10,
        required: true
      },
      {
        name: 'Innovation',
        description: 'Originality and creativity of the approach',
        weight: 30,
        scoreType: 'numeric',
        maxScore: 10,
        required: false
      },
      {
        name: 'Usability',
        description: 'How user-friendly and accessible the solution is',
        weight: 20,
        scoreType: 'numeric',
        maxScore: 10,
        required: false
      },
      {
        name: 'Business Value',
        description: 'Potential impact and business value of the solution',
        weight: 20,
        scoreType: 'numeric',
        maxScore: 10,
        required: false
      }
    ];

    defaultCriteria.forEach(criterion => {
      this.criteriaControls.push(this.fb.group(criterion));
    });

    this.calculateTotalWeight();
  }

  // Suggest criteria using AI
  suggestCriteria(): void {
    this.isGenerating = true;
    
    // Simulate AI service call (replace with actual AI service when ready)
    setTimeout(() => {
      const aiGeneratedCriteria = [
        {
          name: 'Technical Innovation',
          description: 'Evaluates the technical novelty and creativity of the solution',
          weight: 25,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        },
        {
          name: 'Code Quality',
          description: 'Assesses code organization, readability, and maintainability',
          weight: 20,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        },
        {
          name: 'Performance Optimization',
          description: 'Measures efficiency, speed, and resource usage',
          weight: 15,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        },
        {
          name: 'User Experience',
          description: 'Evaluates interface design, usability, and accessibility',
          weight: 20,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        },
        {
          name: 'Documentation Quality',
          description: 'Assesses clarity and completeness of documentation',
          weight: 10,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        },
        {
          name: 'Business Impact',
          description: 'Evaluates potential commercial value and market fit',
          weight: 10,
          scoreType: 'numeric',
          maxScore: 10,
          required: false
        }
      ];

      // Clear existing criteria and add AI generated ones
      while (this.criteriaControls.length) {
        this.criteriaControls.removeAt(0);
      }

      aiGeneratedCriteria.forEach(criterion => {
        this.criteriaControls.push(this.fb.group(criterion));
      });

      this.calculateTotalWeight();
      this.isGenerating = false;
      
      this.snackBar.open('AI-suggested criteria have been generated!', 'Close', {
        duration: 5000,
        panelClass: 'success-snackbar'
      });
    }, 2000);
  }
}