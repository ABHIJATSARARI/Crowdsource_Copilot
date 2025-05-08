import { Component } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatRippleModule,
    MatDividerModule
  ],
  template: `
    <div class="wizard-container tech-grid">
      <!-- AI-inspired pattern overlays -->
      <div class="ai-pattern"></div>
      <div class="neural-grid"></div>
      
      <div class="wizard-header">
        <h1 class="page-title">Create Your Innovation Challenge</h1>
        <div class="progress-container">
          <div class="progress-text">
            <span class="progress-percentage">{{ progressPercentage }}% Complete</span>
            <span class="progress-step">Step {{ currentStepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <mat-progress-bar 
            [value]="progressPercentage" 
            color="primary"
            class="progress-bar">
          </mat-progress-bar>
        </div>
      </div>
      
      <div class="wizard-content">
        <div class="wizard-sidebar glass-panel">
          <div class="sidebar-header">
            <h3>Challenge Setup</h3>
          </div>
          <mat-divider></mat-divider>
          <div class="step-list">
            <div 
              *ngFor="let step of steps; let i = index" 
              class="step-item"
              [class.active]="currentStepIndex === i"
              [class.completed]="i < currentStepIndex"
              (click)="navigateToStep(i + 1)"
              matRipple
              [matTooltip]="step.description">
              <div class="step-icon">
                <div class="step-circle">
                  <mat-icon *ngIf="i < currentStepIndex">check</mat-icon>
                  <span *ngIf="i >= currentStepIndex">{{i + 1}}</span>
                </div>
                <div class="step-connector" *ngIf="i < steps.length - 1"></div>
              </div>
              <div class="step-details">
                <div class="step-label">{{step.label}}</div>
                <div class="step-description">{{step.description}}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="main-content">
          <mat-card class="content-card glass-panel">
            <div class="current-step-header">
              <div class="step-info">
                <h2>{{ steps[currentStepIndex].label }}</h2>
                <p class="step-tagline">{{ steps[currentStepIndex].description }}</p>
              </div>
              <div class="step-actions">
                <button 
                  mat-stroked-button 
                  class="help-button" 
                  matTooltip="Get help with this step">
                  <mat-icon>help_outline</mat-icon>
                  Help
                </button>
              </div>
            </div>
            <mat-divider class="content-divider"></mat-divider>
            
            <div class="step-content">
              <router-outlet></router-outlet>
            </div>
            
            <mat-divider class="content-divider"></mat-divider>
            
            <div class="nav-buttons">
              <button 
                mat-stroked-button 
                *ngIf="currentStepIndex > 0" 
                (click)="previousStep()">
                <mat-icon>arrow_back</mat-icon> Previous
              </button>
              <div class="spacer"></div>
              <button 
                mat-stroked-button 
                *ngIf="currentStepIndex < steps.length - 1" 
                (click)="saveCurrentStep()">
                Save <mat-icon>save</mat-icon>
              </button>
              <button 
                mat-raised-button 
                class="next-button neon-button"
                *ngIf="currentStepIndex < steps.length - 1" 
                (click)="nextStep()">
                Next <mat-icon>arrow_forward</mat-icon>
              </button>
              <button 
                mat-raised-button 
                color="accent" 
                class="finish-button"
                *ngIf="currentStepIndex === steps.length - 1" 
                (click)="finishWizard()">
                Launch Challenge <mat-icon>rocket_launch</mat-icon>
              </button>
            </div>
          </mat-card>
        </div>
      </div>
      
      <!-- AI Assistant -->
      <div class="ai-assistant-container">
        <button mat-fab color="accent" class="ai-button" matTooltip="Ask AI Assistant for help">
          <mat-icon>smart_toy</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container {
      padding: 24px;
      max-width: 1280px;
      margin: 0 auto;
      animation: fadeIn 0.4s ease-in;
      position: relative;
      min-height: calc(100vh - 64px);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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
    
    .wizard-header {
      margin-bottom: 32px;
      padding: 1.5rem;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: var(--border-light);
      position: relative;
      overflow: hidden;
    }
    
    .wizard-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--accent-purple), var(--secondary-500));
    }
    
    .page-title {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    
    .progress-container {
      margin-top: 16px;
    }
    
    .progress-text {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    
    .progress-percentage {
      font-weight: 600;
      color: var(--primary-600);
      font-size: 1.1rem;
    }
    
    .progress-step {
      color: var(--text-secondary);
      background: rgba(var(--primary-rgb), 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .progress-bar {
      height: 8px !important;
      border-radius: 4px !important;
      overflow: hidden;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      background-color: var(--bg-tertiary) !important;
    }
    
    ::ng-deep .progress-bar .mdc-linear-progress__bar-inner {
      border-top-width: 8px !important;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600)) !important;
    }
    
    .wizard-content {
      display: flex;
      gap: 24px;
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
    
    .wizard-sidebar {
      flex: 0 0 320px;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .wizard-sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(to bottom, var(--primary-500), var(--accent-purple));
    }
    
    .sidebar-header {
      padding: 20px;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      color: white;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      z-index: 1;
    }
    
    .sidebar-header h3 {
      margin: 0;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-size: 1.1rem;
    }
    
    .step-list {
      padding: 16px 0;
      position: relative;
      z-index: 1;
    }
    
    .step-item {
      display: flex;
      padding: 14px 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      position: relative;
      color: var(--text-primary);
    }
    
    .step-item:not(:last-child) {
      margin-bottom: 0.5rem;
    }
    
    .step-item:hover {
      background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.05), rgba(var(--primary-rgb), 0.02));
      border-left-color: var(--primary-300);
      transform: translateX(2px);
    }
    
    .step-item.active {
      background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.05));
      border-left-color: var(--primary-600);
      transform: translateX(4px);
    }
    
    .step-item.completed {
      border-left-color: var(--accent-success);
    }
    
    .step-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;
      position: relative;
    }
    
    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      flex-shrink: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: var(--shadow-xs);
      color: var(--text-secondary);
    }
    
    .step-connector {
      position: absolute;
      top: 36px;
      width: 2px;
      height: calc(100% - 18px);
      background-color: var(--border-color);
      margin: 4px 0;
    }
    
    .step-details {
      flex: 1;
    }
    
    .step-label {
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 0.95rem;
      color: var(--text-primary);
      transition: color 0.3s ease;
    }
    
    .step-description {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    
    .step-item.active .step-circle {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      border-color: var(--primary-500);
      color: white;
      box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3);
      transform: scale(1.1);
    }
    
    .step-item.active .step-label {
      color: var(--primary-700);
    }
    
    .step-item.completed .step-circle {
      background: linear-gradient(135deg, var(--accent-success), var(--accent-success-dark));
      border-color: var(--accent-success);
      color: white;
      box-shadow: 0 4px 10px rgba(var(--accent-success-rgb), 0.2);
    }
    
    .main-content {
      flex: 1;
      min-height: 600px;
    }
    
    .content-card {
      padding: 0 !important;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .content-card:hover {
      box-shadow: var(--shadow-primary) !important;
    }
    
    .current-step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      background: var(--bg-tertiary);
      border-bottom: var(--border-light);
      position: relative;
      z-index: 1;
    }
    
    .step-info h2 {
      margin-bottom: 8px;
      font-size: 1.5rem;
      color: var(--text-primary);
      font-weight: 700;
    }
    
    .step-tagline {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.95rem;
    }
    
    .help-button {
      border-radius: 20px;
      padding: 0 16px;
      height: 36px;
      border: 1px solid rgba(var(--primary-rgb), 0.2);
      transition: all 0.3s ease;
      color: var(--text-primary);
    }
    
    .help-button:hover {
      background-color: rgba(var(--primary-rgb), 0.1);
      border-color: rgba(var(--primary-rgb), 0.3);
      transform: translateY(-2px);
    }
    
    .content-divider {
      margin: 0;
    }
    
    .step-content {
      min-height: 400px;
      padding: 32px;
      color: var(--text-primary);
      position: relative;
      z-index: 1;
    }
    
    .nav-buttons {
      display: flex;
      justify-content: space-between;
      padding: 20px 32px;
      background: var(--bg-tertiary);
      border-top: var(--border-light);
      position: relative;
      z-index: 1;
    }
    
    .spacer {
      flex: 1;
    }
    
    button {
      position: relative;
      overflow: hidden;
    }
    
    button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.5s ease-out;
      pointer-events: none;
    }
    
    button:active::after {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
      transition: transform 0.5s ease-out, opacity 0.4s ease-out;
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
    
    .next-button, .finish-button {
      margin-left: 8px;
      font-weight: 500;
      letter-spacing: 0.5px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      padding: 0 24px;
      height: 40px;
      line-height: 40px;
    }
    
    .next-button:hover, .finish-button:hover {
      transform: translateY(-3px);
    }
    
    .finish-button {
      background: linear-gradient(135deg, var(--accent-success), var(--accent-success-dark)) !important;
      box-shadow: 0 4px 12px rgba(var(--accent-success-rgb), 0.2) !important;
    }
    
    .finish-button:hover {
      box-shadow: 0 8px 20px rgba(var(--accent-success-rgb), 0.3) !important;
    }
    
    .ai-assistant-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    
    .ai-button {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--primary-600), var(--accent-purple)) !important;
      box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.25) !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }
    
    .ai-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    .ai-button:hover {
      transform: translateY(-5px) rotate(5deg);
      box-shadow: 0 12px 25px rgba(var(--primary-rgb), 0.35) !important;
    }
    
    .ai-button:hover::before {
      opacity: 1;
    }
    
    .ai-button mat-icon {
      font-size: 28px;
      height: 28px;
      width: 28px;
      animation: pulse 2s infinite;
    }
    
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
    
    @media (max-width: 768px) {
      .wizard-content {
        flex-direction: column;
      }
      
      .wizard-sidebar {
        flex: none;
        width: 100%;
        margin-bottom: 24px;
      }
      
      .step-description {
        display: none;
      }
      
      .current-step-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .step-actions {
        align-self: stretch;
        display: flex;
        justify-content: flex-end;
      }
      
      .page-title {
        font-size: 1.5rem;
      }
      
      .step-content {
        padding: 24px;
      }
      
      .nav-buttons {
        padding: 16px 24px;
      }
    }
  `]
})
export class WizardComponent {
  steps = [
    { 
      label: 'Define Challenge', 
      path: 'step1', 
      description: 'Define the problem statement and goals'
    },
    { 
      label: 'Set Audience', 
      path: 'step2', 
      description: 'Configure audience and registration settings'
    },
    { 
      label: 'Submission Requirements', 
      path: 'step3', 
      description: 'Specify submission format and documentation'
    },
    { 
      label: 'Configure Prizes', 
      path: 'step4', 
      description: 'Set up prize structure and amounts'
    },
    { 
      label: 'Timeline', 
      path: 'step5', 
      description: 'Define challenge timeline and milestones'
    },
    { 
      label: 'Evaluation Criteria', 
      path: 'step6', 
      description: 'Establish review and evaluation criteria'
    },
    { 
      label: 'Monitoring', 
      path: 'step7', 
      description: 'Set up challenge monitoring and communications'
    }
  ];
  
  currentStepIndex = 0;
  
  get progressPercentage(): number {
    return Math.round(((this.currentStepIndex) / (this.steps.length - 1)) * 100);
  }
  
  constructor(private router: Router, private route: ActivatedRoute) {
    // Determine current step based on URL
    this.route.firstChild?.url.subscribe(segments => {
      if (segments && segments.length > 0) {
        const currentPath = segments[0].path;
        const stepNumber = parseInt(currentPath.replace('step', ''));
        this.currentStepIndex = stepNumber - 1;
      }
    });
  }
  
  navigateToStep(stepNumber: number): void {
    this.router.navigate([`step${stepNumber}`], { relativeTo: this.route });
  }
  
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.navigateToStep(this.currentStepIndex + 1);
    }
  }
  
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.navigateToStep(this.currentStepIndex + 1);
    }
  }
  
  saveCurrentStep(): void {
    // In a real app, this would save the current step data
    console.log(`Saving step ${this.currentStepIndex + 1}`);
    // Show a notification to the user
  }
  
  finishWizard(): void {
    // Here we would implement the final submission logic
    // For now, just navigate to the dashboard
    this.router.navigate(['/dashboard']);
  }
}