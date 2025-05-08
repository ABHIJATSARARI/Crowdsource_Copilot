import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AiService } from '../../../core/services/ai.service';

interface PrizeStructure {
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-step4',
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
    MatChipsModule,
    MatTooltipModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  template: `
    <div class="step-container">
      <h2>Prize & Incentives</h2>
      <p class="subtitle">Configure the rewards for your challenge participants</p>
      
      <div class="prize-budget-meter">
        <div class="budget-title">
          <span>Total Prize Budget: {{calculateTotalBudget() | currency}}</span>
          <span *ngIf="getBudgetStatus() !== 'ok'" class="budget-warning">
            <mat-icon>warning</mat-icon>
            {{ getBudgetStatus() === 'low' ? 'Budget may be too low' : 'Budget may be too high' }}
          </span>
        </div>
        <mat-progress-bar 
          [value]="calculateBudgetPercentage()" 
          [color]="getBudgetStatus() === 'ok' ? 'primary' : 'warn'">
        </mat-progress-bar>
        <div class="budget-status">
          <span class="recommended">Recommended: {{getRecommendedBudgetRange()}}</span>
          <span class="allocated">Allocated: {{calculateTotalBudget() | currency}}</span>
        </div>
      </div>
      
      <form [formGroup]="prizeForm">
        <!-- Prize Structure -->
        <div class="form-section">
          <h3>Prize Structure</h3>
          
          <div class="prize-structure-grid">
            <mat-card 
              *ngFor="let structure of prizeStructures" 
              class="prize-structure-card"
              [class.selected]="prizeForm.get('prizeStructure')?.value === structure.name"
              (click)="selectPrizeStructure(structure.name)">
              <mat-card-content>
                <div class="structure-icon">
                  <mat-icon>{{structure.icon}}</mat-icon>
                </div>
                <h4>{{structure.name}}</h4>
                <p>{{structure.description}}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
        
        <!-- Monetary Prizes -->
        <div class="form-section" *ngIf="prizeForm.get('includeMonetaryPrizes')?.value">
          <h3>Monetary Prizes</h3>
          
          <!-- Winner Prizes -->
          <div class="prize-category">
            <h4>Winner Prizes</h4>
            
            <div formArrayName="winnerPrizes" class="prize-list">
              <div *ngFor="let prize of winnerPrizesArray.controls; let i = index" class="prize-item">
                <div [formGroupName]="i" class="prize-row">
                  <mat-form-field appearance="outline" class="prize-rank">
                    <mat-label>Rank</mat-label>
                    <input matInput formControlName="rank" readonly>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="prize-amount">
                    <mat-label>Amount</mat-label>
                    <span matPrefix>$&nbsp;</span>
                    <input matInput type="number" formControlName="amount" min="0">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="prize-description">
                    <mat-label>Description (Optional)</mat-label>
                    <input matInput formControlName="description" placeholder="e.g., First Prize, Grand Winner">
                  </mat-form-field>
                  
                  <div class="prize-actions">
                    <button 
                      mat-icon-button 
                      color="warn" 
                      type="button"
                      *ngIf="i >= 2 || winnerPrizesArray.controls.length > 3"
                      (click)="removeWinnerPrize(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="add-button-container">
                <button 
                  mat-stroked-button 
                  color="primary" 
                  type="button"
                  (click)="addWinnerPrize()">
                  <mat-icon>add</mat-icon> Add Winner Prize
                </button>
              </div>
            </div>
          </div>
          
          <!-- Milestone Prizes -->
          <div class="prize-category" *ngIf="prizeForm.get('includeMilestonePrizes')?.value">
            <h4>Milestone Prizes</h4>
            <p class="helper-text">
              Milestone prizes reward progress throughout the challenge duration
            </p>
            
            <div formArrayName="milestonePrizes" class="prize-list">
              <div *ngFor="let prize of milestonePrizesArray.controls; let i = index" class="prize-item">
                <div [formGroupName]="i" class="prize-row">
                  <mat-form-field appearance="outline" class="milestone-name">
                    <mat-label>Milestone Name</mat-label>
                    <input matInput formControlName="name" placeholder="e.g., Prototype Submission">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="prize-amount">
                    <mat-label>Amount</mat-label>
                    <span matPrefix>$&nbsp;</span>
                    <input matInput type="number" formControlName="amount" min="0">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="milestone-description">
                    <mat-label>Description</mat-label>
                    <input matInput formControlName="description" placeholder="e.g., Best working prototype">
                  </mat-form-field>
                  
                  <div class="prize-actions">
                    <button mat-icon-button color="warn" type="button" (click)="removeMilestonePrize(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="add-button-container">
                <button mat-stroked-button color="primary" type="button" (click)="addMilestonePrize()">
                  <mat-icon>add</mat-icon> Add Milestone Prize
                </button>
              </div>
            </div>
          </div>
          
          <div class="prize-options">
            <mat-slide-toggle formControlName="includeMilestonePrizes" color="primary">
              Include Milestone Prizes
            </mat-slide-toggle>
            <div matTooltip="Milestone prizes can increase engagement and provide interim rewards">
              <mat-icon>info</mat-icon>
            </div>
          </div>
        </div>
        
        <!-- Non-monetary Incentives -->
        <div class="form-section">
          <h3>Non-monetary Incentives</h3>
          
          <div class="prize-options">
            <mat-slide-toggle formControlName="includeNonMonetaryIncentives" color="primary">
              Include Non-monetary Incentives
            </mat-slide-toggle>
          </div>
          
          <div *ngIf="prizeForm.get('includeNonMonetaryIncentives')?.value">
            <div class="incentive-grid">
              <mat-card class="incentive-card" 
                *ngFor="let incentive of nonMonetaryIncentives"
                [class.selected]="isIncentiveSelected(incentive)">
                <mat-card-content>
                  <div class="incentive-checkbox">
                    <mat-checkbox 
                      [checked]="isIncentiveSelected(incentive)"
                      (change)="toggleIncentive(incentive)"
                      color="primary">
                    </mat-checkbox>
                  </div>
                  <div class="incentive-icon">
                    <mat-icon>{{incentive.icon}}</mat-icon>
                  </div>
                  <div class="incentive-name">{{incentive.name}}</div>
                  <div class="incentive-description">{{incentive.description}}</div>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="form-field">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Other Non-monetary Incentives</mat-label>
                <textarea matInput formControlName="otherIncentives" rows="2"
                  placeholder="Describe any additional non-monetary incentives you'd like to offer"></textarea>
              </mat-form-field>
            </div>
          </div>
        </div>
        
        <!-- AI Recommendations -->
        <div class="form-section">
          <h3>AI Prize Recommendations</h3>
          
          <mat-card class="ai-recommendation-card">
            <mat-card-header>
              <div mat-card-avatar class="ai-avatar">
                <mat-icon>auto_awesome</mat-icon>
              </div>
              <mat-card-title>Prize Recommendation</mat-card-title>
              <mat-card-subtitle>Based on challenge type and requirements</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p *ngIf="!prizeRecommendation">
                Let our AI assistant recommend appropriate prize structures and amounts 
                based on your challenge type, requirements, and industry benchmarks.
              </p>
              <p *ngIf="prizeRecommendation">{{prizeRecommendation}}</p>
              <div *ngIf="prizeRecommendation" class="recommendation-details">
                <mat-divider></mat-divider>
                <div class="recommended-structure">
                  <h4>Recommended Structure:</h4>
                  <div class="recommended-prizes">
                    <div class="recommended-prize" *ngFor="let prize of recommendedPrizes">
                      <div class="prize-label">{{prize.label}}:</div>
                      <div class="prize-value">{{prize.amount | currency}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button 
                mat-button 
                color="accent" 
                (click)="getPrizeRecommendation()"
                [disabled]="isLoadingRecommendation">
                <mat-icon>psychology</mat-icon>
                {{prizeRecommendation ? 'Get New Recommendation' : 'Get AI Recommendation'}}
              </button>
              <button 
                mat-button 
                color="primary" 
                *ngIf="prizeRecommendation"
                (click)="applyRecommendation()">
                <mat-icon>check</mat-icon>
                Apply Recommendation
              </button>
            </mat-card-actions>
            <mat-card-footer *ngIf="isLoadingRecommendation">
              <mat-progress-bar mode="indeterminate"></mat-progress-bar>
            </mat-card-footer>
          </mat-card>
        </div>
        
        <!-- Additional Notes -->
        <div class="form-section">
          <h3>Additional Notes</h3>
          
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes about prizes (Optional)</mat-label>
              <textarea 
                matInput 
                formControlName="prizeNotes" 
                rows="3"
                placeholder="Add any additional notes or conditions related to prizes and rewards"></textarea>
              <mat-hint>These notes will be displayed in the challenge details</mat-hint>
            </mat-form-field>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .step-container {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: 32px;
    }
    
    h2 {
      color: var(--text-primary);
      margin-bottom: 8px;
      font-size: 1.7rem;
      font-weight: 600;
      background: linear-gradient(90deg, var(--primary-600), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-align: center;
    }
    
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: 24px;
      text-align: center;
    }
    
    .form-section {
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .form-section h3 {
      margin-bottom: 16px;
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 12px 0;
    }
    
    .reward-details {
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 16px;
      margin-top: 16px;
      border: var(--border-light);
      box-shadow: var(--shadow-sm);
    }
    
    .reward-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }
    
    .reward-label {
      width: 120px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .reward-value {
      flex: 1;
    }
    
    .reward-type {
      flex: 1;
    }
    
    .reward-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .participants-section {
      margin-top: 24px;
    }
    
    .participants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .participant-card {
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      border: var(--border-light);
      box-shadow: var(--shadow-sm);
    }
    
    .participant-card.selected {
      border-color: var(--primary-500);
      background: rgba(var(--primary-rgb), 0.04);
    }
    
    .participant-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 12px;
      background-color: rgba(var(--primary-rgb), 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--primary-500);
    }
    
    .participant-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    
    .participant-name {
      font-weight: 500;
      margin-bottom: 4px;
      color: var(--text-primary);
      text-align: center;
    }
    
    .participant-role {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 8px;
      text-align: center;
    }
    
    .participant-stats {
      display: flex;
      justify-content: center;
      gap: 12px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .stat-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 8px;
    }
    
    .badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 12px;
      background-color: rgba(var(--primary-rgb), 0.1);
      color: var(--primary-600);
    }
    
    .ai-card {
      background: var(--bg-card);
      border-radius: var(--border-radius);
      margin-bottom: 20px;
      border: var(--border-light);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    
    .ai-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(157, 120, 255, 0.05),
        rgba(92, 225, 230, 0.03)
      );
      z-index: 0;
    }
    
    .ai-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-weight: 500;
      color: var(--text-primary);
      position: relative;
    }
    
    .ai-header mat-icon {
      color: var(--accent-purple) !important;
    }
    
    .ai-content {
      color: var(--text-primary);
      position: relative;
    }
    
    .ai-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 8px;
      position: relative;
    }
    
    .helper-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
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

    ::ng-deep .mat-mdc-radio-button.mat-accent {
      --mdc-radio-disabled-selected-icon-color: var(--text-disabled);
      --mdc-radio-disabled-unselected-icon-color: var(--text-disabled);
      --mdc-radio-selected-focus-icon-color: var(--primary-500);
      --mdc-radio-selected-hover-icon-color: var(--primary-500);
      --mdc-radio-selected-icon-color: var(--primary-500);
      --mdc-radio-selected-pressed-icon-color: var(--primary-700);
      --mdc-radio-unselected-focus-icon-color: var(--text-secondary);
      --mdc-radio-unselected-hover-icon-color: var(--text-secondary);
      --mdc-radio-unselected-icon-color: var(--text-secondary);
      --mdc-radio-unselected-pressed-icon-color: var(--text-secondary);
      --mat-radio-ripple-color: var(--primary-500);
    }
    
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background {
      background-color: var(--primary-500) !important;
      border-color: var(--primary-500) !important;
    }

    @media (max-width: 768px) {
      .reward-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .reward-label {
        width: 100%;
      }
      
      .participants-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class Step4Component implements OnInit {
  prizeForm: FormGroup;
  
  prizeStructures: PrizeStructure[] = [
    {
      name: 'Winner Takes All',
      description: 'Single prize for the top submission only.',
      icon: 'emoji_events'
    },
    {
      name: 'Tiered Prizes',
      description: 'Multiple prizes of decreasing value for top submissions.',
      icon: 'leaderboard'
    },
    {
      name: 'Milestone + Final',
      description: 'Interim prizes during the challenge plus final prizes.',
      icon: 'timeline'
    },
    {
      name: 'Equal Distribution',
      description: 'Equal prizes for all qualifying submissions.',
      icon: 'balance'
    }
  ];
  
  nonMonetaryIncentives = [
    {
      name: 'Recognition',
      description: 'Public recognition on platform and social media',
      icon: 'star',
      id: 'recognition'
    },
    {
      name: 'Mentorship',
      description: 'Mentorship opportunities with industry experts',
      icon: 'school',
      id: 'mentorship'
    },
    {
      name: 'Job Opportunities',
      description: 'Potential employment or internship opportunities',
      icon: 'work',
      id: 'jobs'
    },
    {
      name: 'Future Contracts',
      description: 'Consideration for future paid contract work',
      icon: 'handshake',
      id: 'contracts'
    },
    {
      name: 'Certification',
      description: 'Digital certificate or badge of achievement',
      icon: 'verified',
      id: 'certification'
    },
    {
      name: 'Product Testing',
      description: 'Opportunity to test and use the final product',
      icon: 'bug_report',
      id: 'testing'
    }
  ];
  
  selectedIncentives: string[] = ['recognition', 'certification'];
  recommendedBudget = { min: 5000, max: 10000 };
  
  prizeRecommendation: string | null = null;
  isLoadingRecommendation = false;
  recommendedPrizes: {label: string, amount: number}[] = [];
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.prizeForm = this.fb.group({
      prizeStructure: ['Tiered Prizes', Validators.required],
      includeMonetaryPrizes: [true],
      includeMilestonePrizes: [false],
      includeNonMonetaryIncentives: [true],
      selectedIncentives: [this.selectedIncentives],
      otherIncentives: [''],
      prizeNotes: [''],
      winnerPrizes: this.fb.array([]),
      milestonePrizes: this.fb.array([])
    });
    
    // Initialize default prizes based on structure
    this.setupDefaultPrizes();
  }
  
  ngOnInit(): void {
    // Determine recommended budget based on challenge type and context
    // In a real app, this would come from challenge metadata or Step 1
    this.setRecommendedBudget('development'); // Default to development type
    
    // Subscribe to prize structure changes
    this.prizeForm.get('prizeStructure')?.valueChanges.subscribe(structure => {
      this.updatePrizeStructure(structure);
    });
  }
  
  get winnerPrizesArray() {
    return this.prizeForm.get('winnerPrizes') as FormArray;
  }
  
  get milestonePrizesArray() {
    return this.prizeForm.get('milestonePrizes') as FormArray;
  }
  
  setupDefaultPrizes(): void {
    // Clear existing arrays
    while (this.winnerPrizesArray.length) {
      this.winnerPrizesArray.removeAt(0);
    }
    
    // Add default prizes based on selected structure
    const structure = this.prizeForm.get('prizeStructure')?.value;
    
    if (structure === 'Winner Takes All') {
      this.addWinnerPrize('1st', 5000);
    } else if (structure === 'Equal Distribution') {
      this.addWinnerPrize('Winner', 2000);
      this.addWinnerPrize('Winner', 2000);
      this.addWinnerPrize('Winner', 2000);
    } else { // Default to Tiered
      this.addWinnerPrize('1st', 5000);
      this.addWinnerPrize('2nd', 2500);
      this.addWinnerPrize('3rd', 1000);
    }
  }
  
  addWinnerPrize(rank = '', amount = 0, description = ''): void {
    const prizeCount = this.winnerPrizesArray.length;
    
    // If rank is not provided, generate it based on position
    if (!rank) {
      const position = prizeCount + 1;
      if (position === 1) rank = '1st';
      else if (position === 2) rank = '2nd';
      else if (position === 3) rank = '3rd';
      else rank = `${position}th`;
    }
    
    const prizeGroup = this.fb.group({
      rank: [rank, Validators.required],
      amount: [amount, [Validators.required, Validators.min(0)]],
      description: [description]
    });
    
    this.winnerPrizesArray.push(prizeGroup);
  }
  
  removeWinnerPrize(index: number): void {
    this.winnerPrizesArray.removeAt(index);
  }
  
  addMilestonePrize(name = '', amount = 0, description = ''): void {
    const prizeGroup = this.fb.group({
      name: [name || 'Milestone Prize', Validators.required],
      amount: [amount || 1000, [Validators.required, Validators.min(0)]],
      description: [description || 'Awarded during the challenge']
    });
    
    this.milestonePrizesArray.push(prizeGroup);
  }
  
  removeMilestonePrize(index: number): void {
    this.milestonePrizesArray.removeAt(index);
  }
  
  selectPrizeStructure(structure: string): void {
    this.prizeForm.get('prizeStructure')?.setValue(structure);
  }
  
  updatePrizeStructure(structure: string): void {
    // Enable or disable milestone prizes based on structure
    if (structure === 'Milestone + Final') {
      this.prizeForm.get('includeMilestonePrizes')?.setValue(true);
      // Add a default milestone prize if there are none
      if (this.milestonePrizesArray.length === 0) {
        this.addMilestonePrize('Prototype', 1000, 'Best working prototype');
      }
    }
    
    // Reset winner prizes based on new structure
    this.setupDefaultPrizes();
  }
  
  isIncentiveSelected(incentive: any): boolean {
    return this.selectedIncentives.includes(incentive.id);
  }
  
  toggleIncentive(incentive: any): void {
    if (this.isIncentiveSelected(incentive)) {
      this.selectedIncentives = this.selectedIncentives.filter(id => id !== incentive.id);
    } else {
      this.selectedIncentives.push(incentive.id);
    }
    
    // Update form control value
    this.prizeForm.get('selectedIncentives')?.setValue([...this.selectedIncentives]);
  }
  
  calculateTotalBudget(): number {
    let total = 0;
    
    // Sum winner prizes
    if (this.winnerPrizesArray) {
      this.winnerPrizesArray.controls.forEach(control => {
        total += control.get('amount')?.value || 0;
      });
    }
    
    // Sum milestone prizes
    if (this.milestonePrizesArray) {
      this.milestonePrizesArray.controls.forEach(control => {
        total += control.get('amount')?.value || 0;
      });
    }
    
    return total;
  }
  
  setRecommendedBudget(challengeType: string): void {
    // Set recommended budget ranges based on challenge type
    switch(challengeType.toLowerCase()) {
      case 'ideation':
        this.recommendedBudget = { min: 1000, max: 5000 };
        break;
      case 'design':
        this.recommendedBudget = { min: 2000, max: 7500 };
        break;
      case 'development':
        this.recommendedBudget = { min: 5000, max: 15000 };
        break;
      case 'data-science':
        this.recommendedBudget = { min: 5000, max: 20000 };
        break;
      case 'research':
        this.recommendedBudget = { min: 2000, max: 10000 };
        break;
      case 'ai':
        this.recommendedBudget = { min: 7500, max: 25000 };
        break;
      default:
        this.recommendedBudget = { min: 3000, max: 10000 };
    }
  }
  
  getRecommendedBudgetRange(): string {
    return `$${this.recommendedBudget.min.toLocaleString()} - $${this.recommendedBudget.max.toLocaleString()}`;
  }
  
  calculateBudgetPercentage(): number {
    const totalBudget = this.calculateTotalBudget();
    const midPoint = (this.recommendedBudget.min + this.recommendedBudget.max) / 2;
    
    if (totalBudget <= this.recommendedBudget.min) {
      // Scale from 0 to 40% for budgets below minimum
      return (totalBudget / this.recommendedBudget.min) * 40;
    } else if (totalBudget <= this.recommendedBudget.max) {
      // Scale from 40% to 60% for budgets in the recommended range
      const rangePercentage = (totalBudget - this.recommendedBudget.min) / 
        (this.recommendedBudget.max - this.recommendedBudget.min);
      return 40 + (rangePercentage * 20);
    } else {
      // Scale above 60% for budgets above maximum
      const excessRatio = Math.min((totalBudget - this.recommendedBudget.max) / midPoint, 1);
      return 60 + (excessRatio * 40);
    }
  }
  
  getBudgetStatus(): 'low' | 'ok' | 'high' {
    const totalBudget = this.calculateTotalBudget();
    
    if (totalBudget < this.recommendedBudget.min * 0.7) {
      return 'low';
    } else if (totalBudget > this.recommendedBudget.max * 1.3) {
      return 'high';
    }
    return 'ok';
  }
  
  getPrizeRecommendation(): void {
    this.isLoadingRecommendation = true;
    
    // In a real implementation, this would use context from all previous steps
    const challengeType = 'development'; // Example type
    const challengeComplexity = 'medium';
    const challengeDuration = '8 weeks';
    
    const prompt = `
      As an expert in innovation challenges, please recommend a prize structure for a 
      ${challengeType} challenge with ${challengeComplexity} complexity and ${challengeDuration} 
      duration.
      
      Please provide:
      1. A brief explanation of the recommended prize structure and rationale
      2. Suggested monetary prize amounts for winners and any milestones
      3. Recommend 2-3 non-monetary incentives that would be appropriate

      Format the response as a brief paragraph of advice, followed by specific prize recommendations.
    `;
    
    this.aiService.getRecommendation(prompt).subscribe(
      (response) => {
        this.prizeRecommendation = response;
        
        // In a real implementation, we would parse the AI response to extract
        // the recommended prize amounts. Here we'll use placeholder data.
        this.recommendedPrizes = [
          { label: '1st Place', amount: 7500 },
          { label: '2nd Place', amount: 3500 },
          { label: '3rd Place', amount: 1500 },
          { label: 'Prototype', amount: 1000 }
        ];
        
        this.isLoadingRecommendation = false;
      },
      (error) => {
        console.error('Error getting prize recommendation:', error);
        this.isLoadingRecommendation = false;
        this.prizeRecommendation = 'Sorry, we encountered an error generating recommendations. Please try again later.';
      }
    );
  }
  
  applyRecommendation(): void {
    if (this.recommendedPrizes.length === 0) {
      return;
    }
    
    // Clear existing prize arrays
    while (this.winnerPrizesArray.length) {
      this.winnerPrizesArray.removeAt(0);
    }
    
    while (this.milestonePrizesArray.length) {
      this.milestonePrizesArray.removeAt(0);
    }
    
    // Apply recommended prizes
    this.recommendedPrizes.forEach(prize => {
      if (prize.label.toLowerCase().includes('place') || 
          prize.label.toLowerCase().includes('winner')) {
        // This is a winner prize
        this.addWinnerPrize(prize.label, prize.amount);
      } else {
        // This is likely a milestone prize
        this.addMilestonePrize(prize.label, prize.amount);
        this.prizeForm.get('includeMilestonePrizes')?.setValue(true);
      }
    });
    
    // Set structure based on prizes
    if (this.milestonePrizesArray.length > 0) {
      this.prizeForm.get('prizeStructure')?.setValue('Milestone + Final');
    } else if (this.winnerPrizesArray.length === 1) {
      this.prizeForm.get('prizeStructure')?.setValue('Winner Takes All');
    } else if (this.winnerPrizesArray.length > 1) {
      // Check if all prizes are equal
      const firstAmount = this.winnerPrizesArray.at(0).get('amount')?.value;
      const allEqual = this.winnerPrizesArray.controls.every(
        control => control.get('amount')?.value === firstAmount
      );
      
      if (allEqual) {
        this.prizeForm.get('prizeStructure')?.setValue('Equal Distribution');
      } else {
        this.prizeForm.get('prizeStructure')?.setValue('Tiered Prizes');
      }
    }
  }
}