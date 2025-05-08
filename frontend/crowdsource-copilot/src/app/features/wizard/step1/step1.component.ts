import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { AiService } from '../../../core/services/ai.service';
import { cardAnimation, fadeInAnimation, listAnimation, slideInAnimation } from '../../../shared/animations';

interface ChallengeSuggestion {
  title: string;
  problemStatement: string;
  goals: string;
  type: string;
  tags: string[];
}

@Component({
  selector: 'app-step1',
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
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule
  ],
  animations: [fadeInAnimation, slideInAnimation, cardAnimation, listAnimation],
  template: `
    <div class="step-container" @fadeInAnimation>
      <div class="step-header" @slideInAnimation>
        <h2 class="section-title">Define Your Challenge</h2>
        <p class="section-description">Start with a clear definition of your challenge to attract the right participants and solutions</p>
      </div>
      
      <div class="main-content glass-panel">
        <form [formGroup]="challengeForm" @fadeInAnimation>
          <!-- Challenge Title -->
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Challenge Title</mat-label>
              <input 
                matInput 
                formControlName="title" 
                placeholder="Enter a concise, descriptive title" 
                required>
              <mat-icon matSuffix>title</mat-icon>
              <mat-error *ngIf="challengeForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
              <mat-hint>A compelling title increases engagement (50-70 characters recommended)</mat-hint>
            </mat-form-field>
          </div>
          
          <!-- Problem Statement -->
          <div class="form-field">
            <div class="field-header">
              <h3>Problem Statement</h3>
              <div class="word-count" [class.warning]="getProblemStatementWordCount() > 200">
                {{getProblemStatementWordCount()}} / 200 words
              </div>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Problem Statement</mat-label>
              <textarea 
                matInput 
                formControlName="problemStatement" 
                rows="5" 
                placeholder="Describe the problem that needs to be solved" 
                required></textarea>
              <mat-error *ngIf="challengeForm.get('problemStatement')?.hasError('required')">
                Problem statement is required
              </mat-error>
            </mat-form-field>
            <div class="field-actions">
              <button 
                mat-stroked-button 
                color="primary" 
                type="button"
                [disabled]="isImprovingText || !challengeForm.get('problemStatement')?.value"
                (click)="improveProblemStatement()"
                class="ai-button">
                <mat-icon>auto_awesome</mat-icon>
                Improve with AI
              </button>
              <button 
                mat-button 
                color="warn" 
                type="button"
                *ngIf="challengeForm.get('problemStatement')?.value"
                (click)="clearField('problemStatement')"
                class="clear-button">
                <mat-icon>delete_outline</mat-icon>
                Clear
              </button>
              <mat-spinner diameter="24" *ngIf="isImprovingText"></mat-spinner>
            </div>
            <div class="field-tips">
              <mat-icon color="primary">lightbulb</mat-icon>
              <span>Effective problem statements clearly define the issue, its impact, and why solving it matters</span>
            </div>
          </div>
          
          <!-- Challenge Goals -->
          <div class="form-field">
            <div class="field-header">
              <h3>Challenge Goals</h3>
              <div class="word-count" [class.warning]="getGoalsWordCount() > 100">
                {{getGoalsWordCount()}} / 100 words
              </div>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Challenge Goals</mat-label>
              <textarea 
                matInput 
                formControlName="goals" 
                rows="3" 
                placeholder="What are the main objectives you aim to achieve?"></textarea>
            </mat-form-field>
            <div class="field-actions">
              <button 
                mat-stroked-button 
                color="primary" 
                type="button"
                [disabled]="isImprovingGoals || !challengeForm.get('goals')?.value"
                (click)="improveGoals()"
                class="ai-button">
                <mat-icon>auto_awesome</mat-icon>
                Refine Goals
              </button>
              <button 
                mat-button 
                color="warn" 
                type="button"
                *ngIf="challengeForm.get('goals')?.value"
                (click)="clearField('goals')"
                class="clear-button">
                <mat-icon>delete_outline</mat-icon>
                Clear
              </button>
              <mat-spinner diameter="24" *ngIf="isImprovingGoals"></mat-spinner>
            </div>
            <div class="field-tips">
              <mat-icon color="primary">lightbulb</mat-icon>
              <span>Make goals specific, measurable, and time-bound for best results</span>
            </div>
          </div>
          
          <div class="two-column-fields">
            <!-- Challenge Type -->
            <div class="form-field">
              <h3>Challenge Type</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Type</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option *ngFor="let type of challengeTypes" [value]="type.value">
                    {{type.label}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>category</mat-icon>
                <mat-error *ngIf="challengeForm.get('type')?.hasError('required')">
                  Challenge type is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Challenge Tags -->
            <div class="form-field">
              <h3>Challenge Tags</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Add Tags (press Enter to add)</mat-label>
                <mat-chip-grid #chipGrid>
                  <mat-chip-row 
                    *ngFor="let tag of tags" 
                    (removed)="removeTag(tag)"
                    @listAnimation>
                    {{tag}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip-row>
                  <input 
                    placeholder="Add relevant tags..."
                    [matChipInputFor]="chipGrid"
                    [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                    (matChipInputTokenEnd)="addTag($event)">
                </mat-chip-grid>
              </mat-form-field>
              <div class="field-actions">
                <button 
                  mat-stroked-button 
                  color="primary" 
                  type="button"
                  [disabled]="!challengeForm.get('problemStatement')?.value || isSuggestingTags"
                  (click)="suggestTags()"
                  class="ai-button">
                  <mat-icon>psychology</mat-icon>
                  Suggest Tags
                </button>
                <mat-spinner diameter="24" *ngIf="isSuggestingTags"></mat-spinner>
              </div>
            </div>
          </div>
        </form>
        
        <mat-divider class="section-divider"></mat-divider>
        
        <!-- Examples Section -->
        <div class="examples-section" @cardAnimation>
          <h3>Challenge Examples</h3>
          
          <mat-accordion>
            <mat-expansion-panel class="example-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon class="example-icon">lightbulb</mat-icon>
                  Software Development Example
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="example-content">
                <p><strong>Title:</strong> Reducing Urban Food Waste Through Mobile Technology</p>
                <p><strong>Problem Statement:</strong> Urban areas generate millions of tons of food waste annually while many face food insecurity. Current solutions are fragmented and inefficient in connecting excess food with those who need it.</p>
                <p><strong>Goals:</strong> Create a technology solution that reduces urban food waste by 20% within one year by connecting food suppliers with distribution networks and those in need.</p>
                <p><strong>Type:</strong> Software Development</p>
                <p><strong>Tags:</strong> food-waste, sustainability, mobile-app, urban-solutions, social-impact</p>
                <button mat-stroked-button color="primary" (click)="useExample(0)" class="example-button">
                  <mat-icon>content_copy</mat-icon> Use This Example
                </button>
              </div>
            </mat-expansion-panel>
            
            <mat-expansion-panel class="example-panel">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <mat-icon class="example-icon">psychology</mat-icon>
                  AI/ML Challenge Example
                </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="example-content">
                <p><strong>Title:</strong> AI Solution for Early Disease Detection in Crops</p>
                <p><strong>Problem Statement:</strong> Crop diseases cause approximately 40% of agricultural yield losses globally. Current detection methods are often too slow, allowing diseases to spread before they're identified.</p>
                <p><strong>Goals:</strong> Develop an AI-based system that can identify crop diseases with at least 90% accuracy from smartphone images, providing recommendations within seconds.</p>
                <p><strong>Type:</strong> AI/ML</p>
                <p><strong>Tags:</strong> agriculture, disease-detection, machine-learning, computer-vision, food-security</p>
                <button mat-stroked-button color="primary" (click)="useExample(1)" class="example-button">
                  <mat-icon>content_copy</mat-icon> Use This Example
                </button>
              </div>
            </mat-expansion-panel>
          </mat-accordion>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-container {
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .step-header {
      margin-bottom: 32px;
      text-align: center;
    }
    
    .section-title {
      color: var(--text-primary);
      margin-bottom: 8px;
      font-size: 1.7rem;
      font-weight: 600;
      background: linear-gradient(90deg, var(--primary-600), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .section-description {
      color: var(--text-secondary);
      font-size: 1rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .main-content {
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      border: var(--border-light);
      position: relative;
      overflow: hidden;
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
    
    .form-field {
      margin-bottom: 28px;
      position: relative;
      z-index: 1;
    }

    .two-column-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
    }
    
    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .field-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .word-count {
      font-size: 12px;
      color: var(--text-secondary);
      background: rgba(var(--primary-rgb), 0.07);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }
    
    .word-count.warning {
      color: var(--error-color);
      background: rgba(var(--error-rgb), 0.1);
    }
    
    .full-width {
      width: 100%;
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

    ::ng-deep .mat-mdc-select-value-text {
      color: var(--text-primary) !important;
    }

    ::ng-deep .mat-mdc-select-arrow {
      color: var(--text-secondary) !important;
    }

    ::ng-deep .mat-mdc-chip-row {
      background: rgba(var(--primary-rgb), 0.08) !important;
      color: var(--text-primary) !important;
    }

    ::ng-deep .mat-mdc-chip-action-label {
      color: var(--text-primary) !important;
    }

    ::ng-deep .mat-mdc-chip-row .mat-icon {
      color: var(--text-secondary) !important;
      opacity: 0.7;
    }

    ::ng-deep .mat-mdc-chip-input {
      color: var(--text-primary) !important;
    }
    
    .field-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
    }
    
    .field-tips {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: var(--border-radius);
      background-color: var(--bg-tertiary);
      border: 1px solid rgba(var(--primary-rgb), 0.1);
    }
    
    .field-tips mat-icon {
      font-size: 18px;
      color: var(--primary-500) !important;
    }
    
    .field-tips span {
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-secondary);
    }
    
    .ai-button {
      position: relative;
      padding-left: 16px;
      background: rgba(var(--primary-rgb), 0.05) !important;
      border: 1px solid rgba(var(--primary-rgb), 0.2) !important;
      color: var(--primary-700) !important;
      transition: all 0.2s ease;
    }
    
    .ai-button:hover:not([disabled]) {
      background: rgba(var(--primary-rgb), 0.1) !important;
      border-color: rgba(var(--primary-rgb), 0.3) !important;
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    
    .ai-button mat-icon {
      margin-right: 8px;
      color: var(--primary-500);
    }
    
    .clear-button {
      color: var(--error-color) !important;
    }
    
    .section-divider {
      margin: 32px 0;
      opacity: 0.5;
      border-top-color: var(--border-color) !important;
    }
    
    .examples-section {
      margin-top: 24px;
      position: relative;
      z-index: 1;
    }
    
    .examples-section h3 {
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .example-panel {
      margin-bottom: 16px !important;
      border-radius: var(--border-radius) !important;
      border: var(--border-light) !important;
      background: var(--bg-card) !important;
      box-shadow: var(--shadow-sm) !important;
    }

    ::ng-deep .example-panel .mat-expansion-panel-body {
      background: var(--bg-tertiary) !important;
      color: var(--text-primary) !important;
    }
    
    ::ng-deep .example-panel .mat-expansion-panel-header {
      background: var(--bg-card) !important;
    }

    ::ng-deep .example-panel .mat-expansion-panel-header-title {
      color: var(--text-primary) !important;
    }

    ::ng-deep .example-panel .mat-expansion-indicator::after {
      color: var(--text-secondary) !important;
    }
    
    .example-icon {
      margin-right: 8px;
      color: var(--primary-500) !important;
    }
    
    .example-content {
      padding: 16px 8px;
    }
    
    .example-content p {
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .example-content strong {
      color: var(--primary-700);
    }
    
    .example-button {
      margin-top: 16px;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700)) !important;
      color: white !important;
      box-shadow: var(--shadow-primary) !important;
      transition: all 0.2s ease !important;
      border: none !important;
    }

    .example-button:hover {
      background: var(--primary-700) !important;
      transform: translateY(-2px);
      box-shadow: var(--shadow-primary), 0 0 15px var(--primary-500) !important;
    }
    
    @media (max-width: 768px) {
      .two-column-fields {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class Step1Component implements OnInit {
  challengeForm: FormGroup;
  tags: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isImprovingText = false;
  isImprovingGoals = false;
  isSuggestingTags = false;
  
  challengeTypes = [
    { value: 'ideation', label: 'Ideation - Generate new ideas and concepts' },
    { value: 'development', label: 'Software Development - Build functional solutions' },
    { value: 'data-science', label: 'Data Science - Extract insights from data' },
    { value: 'design', label: 'Design - Create visual solutions' },
    { value: 'research', label: 'Research - Explore and investigate' },
    { value: 'ai', label: 'AI/ML - Develop machine learning solutions' },
    { value: 'hardware', label: 'Hardware - Create physical products' },
    { value: 'sustainability', label: 'Sustainability - Environmental solutions' }
  ];
  
  examples: ChallengeSuggestion[] = [
    {
      title: 'Reducing Urban Food Waste Through Mobile Technology',
      problemStatement: 'Urban areas generate millions of tons of food waste annually while many face food insecurity. Current solutions are fragmented and inefficient in connecting excess food with those who need it.',
      goals: 'Create a technology solution that reduces urban food waste by 20% within one year by connecting food suppliers with distribution networks and those in need.',
      type: 'development',
      tags: ['food-waste', 'sustainability', 'mobile-app', 'urban-solutions', 'social-impact']
    },
    {
      title: 'AI Solution for Early Disease Detection in Crops',
      problemStatement: 'Crop diseases cause approximately 40% of agricultural yield losses globally. Current detection methods are often too slow, allowing diseases to spread before they\'re identified.',
      goals: 'Develop an AI-based system that can identify crop diseases with at least 90% accuracy from smartphone images, providing recommendations within seconds.',
      type: 'ai',
      tags: ['agriculture', 'disease-detection', 'machine-learning', 'computer-vision', 'food-security']
    }
  ];
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      problemStatement: ['', Validators.required],
      goals: [''],
      type: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Load saved data from state management if available
    // This would be implemented with NgRx
  }
  
  getProblemStatementWordCount(): number {
    const text = this.challengeForm.get('problemStatement')?.value || '';
    return text ? text.trim().split(/\s+/).length : 0;
  }
  
  getGoalsWordCount(): number {
    const text = this.challengeForm.get('goals')?.value || '';
    return text ? text.trim().split(/\s+/).length : 0;
  }
  
  clearField(fieldName: string): void {
    this.challengeForm.get(fieldName)?.setValue('');
  }
  
  improveProblemStatement(): void {
    const currentStatement = this.challengeForm.get('problemStatement')?.value;
    
    if (currentStatement) {
      this.isImprovingText = true;
      
      this.aiService.improveText(currentStatement, 'problem').subscribe(
        (improvedText) => {
          this.challengeForm.get('problemStatement')?.setValue(improvedText);
          this.isImprovingText = false;
        },
        (error) => {
          console.error('Error improving problem statement:', error);
          this.isImprovingText = false;
        }
      );
    }
  }
  
  improveGoals(): void {
    const currentGoals = this.challengeForm.get('goals')?.value;
    
    if (currentGoals) {
      this.isImprovingGoals = true;
      
      this.aiService.improveText(currentGoals, 'goals').subscribe(
        (improvedText) => {
          this.challengeForm.get('goals')?.setValue(improvedText);
          this.isImprovingGoals = false;
        },
        (error) => {
          console.error('Error improving goals:', error);
          this.isImprovingGoals = false;
        }
      );
    }
  }
  
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    if (value) {
      this.tags.push(value);
    }
    
    event.chipInput!.clear();
  }
  
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  suggestTags(): void {
    const problemStatement = this.challengeForm.get('problemStatement')?.value;
    const type = this.challengeForm.get('type')?.value;
    
    if (problemStatement) {
      this.isSuggestingTags = true;
      
      const prompt = `Based on this problem statement: "${problemStatement}" and challenge type: "${type}", 
                     suggest 5 relevant keywords or tags that would help categorize this innovation challenge.
                     Return just the tags separated by commas without explanations.`;
      
      this.aiService.getRecommendation(prompt).subscribe(
        (response) => {
          const suggestedTags = response
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag && !this.tags.includes(tag));
          
          this.tags = [...this.tags, ...suggestedTags];
          this.isSuggestingTags = false;
        },
        (error) => {
          console.error('Error suggesting tags:', error);
          this.isSuggestingTags = false;
        }
      );
    }
  }
  
  useExample(index: number): void {
    if (index >= 0 && index < this.examples.length) {
      const example = this.examples[index];
      
      this.challengeForm.patchValue({
        title: example.title,
        problemStatement: example.problemStatement,
        goals: example.goals,
        type: example.type
      });
      
      this.tags = [...example.tags];
    }
  }
}