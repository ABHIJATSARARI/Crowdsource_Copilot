import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-step2',
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
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="step-container" @fadeInAnimation>
      <div class="step-header" @slideInAnimation>
        <h2 class="section-title">Set Your Audience & Registration</h2>
        <p class="section-description">Configure who can participate in your challenge</p>
      </div>
      
      <div class="main-content glass-panel">
        <form [formGroup]="audienceForm">
          <!-- Participant Type -->
          <div class="form-section">
            <h3>Participant Type</h3>
            
            <div class="form-field">
              <mat-card class="selection-card" [class.selected]="audienceForm.get('participantType')?.value === 'open'">
                <div class="card-header">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="title-with-toggle">
                        <span>Open Challenge</span>
                        <mat-slide-toggle 
                          [checked]="audienceForm.get('participantType')?.value === 'open'"
                          (change)="audienceForm.get('participantType')?.setValue('open')"
                          color="primary">
                        </mat-slide-toggle>
                      </div>
                    </mat-card-title>
                  </mat-card-header>
                </div>
                <mat-card-content>
                  <p>
                    <strong>Open to all participants</strong> who register on the platform.
                    Maximum visibility and broadest talent pool.
                  </p>
                  <div class="benefits">
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>Larger participant pool</span>
                    </div>
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>More diverse solutions</span>
                    </div>
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>Higher submission volume</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="form-field">
              <mat-card class="selection-card" [class.selected]="audienceForm.get('participantType')?.value === 'invite'">
                <div class="card-header">
                  <mat-card-header>
                    <mat-card-title>
                      <div class="title-with-toggle">
                        <span>Invite-Only Challenge</span>
                        <mat-slide-toggle 
                          [checked]="audienceForm.get('participantType')?.value === 'invite'"
                          (change)="audienceForm.get('participantType')?.setValue('invite')"
                          color="primary">
                        </mat-slide-toggle>
                      </div>
                    </mat-card-title>
                  </mat-card-header>
                </div>
                <mat-card-content>
                  <p>
                    <strong>Restricted to invited participants</strong> only.
                    Better for sensitive projects or when targeting specific expertise.
                  </p>
                  <div class="benefits">
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>More control over participants</span>
                    </div>
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>Enhanced confidentiality</span>
                    </div>
                    <div class="benefit-item">
                      <mat-icon color="primary">check_circle</mat-icon>
                      <span>Target specific expertise</span>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
          
          <!-- Geographic Filters -->
          <div class="form-section">
            <h3>Geographic Filters</h3>
            
            <div class="form-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Geographic Scope</mat-label>
                <mat-select formControlName="geographicScope">
                  <mat-option value="global">Global - Open to all regions</mat-option>
                  <mat-option value="regional">Regional - Specific regions only</mat-option>
                  <mat-option value="country">Country-specific</mat-option>
                </mat-select>
                <mat-hint>Define the geographic reach of your challenge</mat-hint>
              </mat-form-field>
            </div>
            
            <div class="form-field" *ngIf="audienceForm.get('geographicScope')?.value === 'regional'">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Regions</mat-label>
                <mat-select formControlName="regions" multiple>
                  <mat-option value="north_america">North America</mat-option>
                  <mat-option value="south_america">South America</mat-option>
                  <mat-option value="europe">Europe</mat-option>
                  <mat-option value="asia">Asia</mat-option>
                  <mat-option value="africa">Africa</mat-option>
                  <mat-option value="oceania">Oceania</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-field" *ngIf="audienceForm.get('geographicScope')?.value === 'country'">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Countries</mat-label>
                <mat-select formControlName="countries" multiple>
                  <mat-option value="us">United States</mat-option>
                  <mat-option value="ca">Canada</mat-option>
                  <mat-option value="uk">United Kingdom</mat-option>
                  <mat-option value="in">India</mat-option>
                  <mat-option value="au">Australia</mat-option>
                  <mat-option value="other">Other (specify in requirements)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          
          <!-- Team Configuration -->
          <div class="form-section">
            <h3>Team Configuration</h3>
            
            <div class="form-field">
              <mat-slide-toggle formControlName="allowTeams" color="primary">
                Allow team participation
              </mat-slide-toggle>
              <p class="helper-text">
                Enable participants to form teams and collaborate on submissions
              </p>
            </div>
            
            <div *ngIf="audienceForm.get('allowTeams')?.value">
              <div class="form-field">
                <mat-form-field appearance="outline">
                  <mat-label>Minimum Team Size</mat-label>
                  <input matInput formControlName="minTeamSize" type="number" min="1" max="10">
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="ml-16">
                  <mat-label>Maximum Team Size</mat-label>
                  <input matInput formControlName="maxTeamSize" type="number" min="2" max="20">
                  <mat-error *ngIf="audienceForm.hasError('teamSizeError')">
                    Maximum size must be greater than minimum size
                  </mat-error>
                </mat-form-field>
              </div>
              
              <div class="form-field">
                <mat-slide-toggle formControlName="allowCrossRegionTeams" color="primary">
                  Allow cross-region/country teams
                </mat-slide-toggle>
                <p class="helper-text">
                  Enable team members from different regions/countries to collaborate
                </p>
              </div>
            </div>
          </div>
          
          <!-- Communication Channels -->
          <div class="form-section">
            <h3>Communication Channels</h3>
            
            <div class="form-field">
              <mat-slide-toggle formControlName="enableForum" color="primary">
                Enable Discussion Forum
              </mat-slide-toggle>
              <p class="helper-text">
                Create a forum where participants can discuss the challenge and ask questions
              </p>
            </div>
            
            <div class="form-field">
              <mat-slide-toggle formControlName="enableQA" color="primary">
                Enable Q&A Board
              </mat-slide-toggle>
              <p class="helper-text">
                Create a dedicated Q&A section for official responses from the challenge organizers
              </p>
            </div>
            
            <div class="form-field" *ngIf="audienceForm.get('enableQA')?.value">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Q&A Response Time Commitment</mat-label>
                <mat-select formControlName="qaResponseTime">
                  <mat-option value="24h">Within 24 hours</mat-option>
                  <mat-option value="48h">Within 48 hours</mat-option>
                  <mat-option value="72h">Within 72 hours</mat-option>
                  <mat-option value="week">Within one week</mat-option>
                </mat-select>
                <mat-hint>How quickly do you commit to responding to questions?</mat-hint>
              </mat-form-field>
            </div>
          </div>
          
          <!-- Skills & Expertise -->
          <div class="form-section last-section">
            <h3>Required Skills & Expertise</h3>
            <p class="section-subtitle">Optional: Recommend specific skills for participants</p>
            
            <div class="form-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Recommended Skills (Optional)</mat-label>
                <textarea 
                  matInput 
                  formControlName="recommendedSkills"
                  rows="3"
                  placeholder="List skills that would be beneficial for participants, e.g.: Machine Learning, UX Design, Python"></textarea>
                <mat-hint>These will be shown to potential participants but are not enforced</mat-hint>
              </mat-form-field>
              <div class="ai-actions">
                <button 
                  mat-stroked-button 
                  color="primary" 
                  type="button"
                  [disabled]="!hasEnoughContext()"
                  (click)="suggestSkills()"
                  class="ai-button">
                  <mat-icon>psychology</mat-icon>
                  Suggest Skills with AI
                </button>
              </div>
            </div>
          </div>
          
          <!-- AI Recommendations -->
          <mat-card class="ai-recommendation-card" *ngIf="audienceRecommendation" @cardAnimation>
            <mat-card-header>
              <div mat-card-avatar class="ai-avatar">
                <mat-icon>auto_awesome</mat-icon>
              </div>
              <mat-card-title>AI Recommendation</mat-card-title>
              <mat-card-subtitle>Based on your challenge configuration</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{audienceRecommendation}}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="getAudienceRecommendation()" class="refresh-button">
                <mat-icon>refresh</mat-icon> Get New Recommendation
              </button>
            </mat-card-actions>
          </mat-card>
        </form>
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
    
    .section-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: 0;
      margin-bottom: 16px;
    }
    
    .form-section {
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      position: relative;
      z-index: 1;
    }
    
    .last-section {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .form-section h3 {
      margin-bottom: 16px;
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 500;
    }
    
    .form-field {
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    .full-width {
      width: 100%;
    }
    
    .ml-16 {
      margin-left: 16px;
    }
    
    .helper-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
      margin-left: 34px;
    }
    
    .selection-card {
      margin-bottom: 16px;
      border: 2px solid transparent;
      border-radius: var(--border-radius) !important;
      transition: all 0.3s ease;
      background: var(--bg-card) !important;
      box-shadow: var(--shadow-sm) !important;
    }
    
    .selection-card.selected {
      border-color: var(--primary-500) !important;
      background-color: rgba(var(--primary-rgb), 0.04) !important;
      box-shadow: var(--shadow-primary) !important;
    }
    
    .selection-card mat-card-content {
      color: var(--text-primary);
    }
    
    .selection-card strong {
      color: var(--primary-600);
    }
    
    .title-with-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      color: var(--text-primary);
    }
    
    .benefits {
      margin-top: 16px;
    }
    
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    
    .benefit-item mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      color: var(--primary-500) !important;
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

    ::ng-deep .mat-mdc-slide-toggle .mdc-switch:enabled .mdc-switch__track::before {
      background: rgba(var(--primary-rgb), 0.5) !important;
    }

    ::ng-deep .mat-mdc-slide-toggle .mdc-switch:enabled .mdc-switch__track::after {
      background: var(--primary-400) !important;
    }

    ::ng-deep .mat-mdc-slide-toggle .mdc-switch:enabled:hover .mdc-switch__track::before {
      background: rgba(var(--primary-rgb), 0.6) !important;
    }

    ::ng-deep .mat-mdc-slide-toggle .mdc-switch__handle-track {
      background: var(--primary-500) !important;
    }

    ::ng-deep .mat-mdc-slide-toggle .mdc-switch__handle {
      background: var(--primary-50) !important;
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
    
    .ai-recommendation-card {
      margin: 24px 0;
      background-color: var(--bg-card) !important;
      border-radius: var(--border-radius) !important;
      border: 1px solid rgba(var(--primary-rgb), 0.2) !important;
      box-shadow: var(--shadow-sm) !important;
    }
    
    .ai-recommendation-card mat-card-title {
      color: var(--text-primary) !important;
    }
    
    .ai-recommendation-card mat-card-subtitle {
      color: var(--text-secondary) !important;
    }
    
    .ai-recommendation-card mat-card-content {
      color: var(--text-primary) !important;
      padding: 16px;
      background: rgba(var(--primary-rgb), 0.03);
      border-radius: 8px;
      font-style: italic;
    }
    
    .ai-avatar {
      background: linear-gradient(135deg, var(--primary-500), var(--accent-purple)) !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ai-avatar mat-icon {
      color: white;
      font-size: 20px;
      height: 20px;
      width: 20px;
    }
    
    .ai-actions {
      margin-top: 12px;
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
    
    .refresh-button {
      color: var(--primary-600) !important;
    }
    
    .refresh-button:hover {
      background: rgba(var(--primary-rgb), 0.05) !important;
    }
    
    @media (max-width: 768px) {
      .ml-16 {
        margin-left: 0;
        margin-top: 16px;
      }
    }
  `]
})
export class Step2Component implements OnInit {
  audienceForm: FormGroup;
  audienceRecommendation: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.audienceForm = this.fb.group({
      participantType: ['open', Validators.required],
      geographicScope: ['global', Validators.required],
      regions: [[]],
      countries: [[]],
      allowTeams: [true],
      minTeamSize: [1],
      maxTeamSize: [5],
      allowCrossRegionTeams: [true],
      enableForum: [true],
      enableQA: [true],
      qaResponseTime: ['48h'],
      recommendedSkills: ['']
    }, { validators: this.teamSizeValidator });
  }
  
  ngOnInit(): void {
    // Load saved data from state management if available
    // This would be implemented with NgRx
    
    // Get initial AI recommendation
    this.getAudienceRecommendation();
  }
  
  teamSizeValidator(form: FormGroup) {
    const minTeamSize = form.get('minTeamSize')?.value;
    const maxTeamSize = form.get('maxTeamSize')?.value;
    
    if (minTeamSize && maxTeamSize && maxTeamSize < minTeamSize) {
      return { teamSizeError: true };
    }
    
    return null;
  }
  
  suggestSkills(): void {
    // Create a prompt based on the challenge context
    // In a real implementation, we would get this from NgRx state
    const challengeType = 'development'; // This would come from step 1
    const problemStatement = 'Building a sustainable urban food waste solution'; // From step 1
    
    const prompt = `Based on a ${challengeType} challenge with the problem statement: "${problemStatement}", 
                    suggest 5-8 relevant skills that would be beneficial for participants.
                    Please provide the skills as a comma-separated list.`;
    
    this.aiService.getRecommendation(prompt).subscribe(
      (response) => {
        this.audienceForm.get('recommendedSkills')?.setValue(response);
      },
      (error) => {
        console.error('Error getting skill recommendations:', error);
      }
    );
  }
  
  getAudienceRecommendation(): void {
    if (!this.hasEnoughContext()) {
      return;
    }
    
    const formValues = this.audienceForm.value;
    
    // Create a prompt based on form values
    const prompt = `Generate a brief recommendation about audience configuration for an innovation challenge with these settings:
                    - Participant Type: ${formValues.participantType === 'open' ? 'Open to all' : 'Invite-only'}
                    - Geographic Scope: ${formValues.geographicScope}
                    - Team Participation: ${formValues.allowTeams ? 'Allowed' : 'Not allowed'}
                    - Forum Enabled: ${formValues.enableForum}
                    - Q&A Board: ${formValues.enableQA}
                    
                    Provide a concise, 2-3 sentence recommendation about this configuration,
                    including any potential improvements or considerations.`;
    
    this.aiService.getRecommendation(prompt).subscribe(
      (response) => {
        this.audienceRecommendation = response;
      },
      (error) => {
        console.error('Error getting audience recommendations:', error);
      }
    );
  }
  
  hasEnoughContext(): boolean {
    // In a real implementation, we would check if we have enough context from previous steps
    // For now, just return true for demonstration
    return true;
  }
}