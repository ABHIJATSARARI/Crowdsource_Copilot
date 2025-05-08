import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatStepperModule,
    MatExpansionModule
  ],
  template: `
    <div class="support-container tech-grid">
      <!-- Futuristic AI pattern overlay -->
      <div class="ai-pattern"></div>
      <div class="neural-grid"></div>

      <div class="page-header">
        <h1 class="neon-text">Support & Help Center</h1>
        <p class="subtitle">Get assistance with your innovation challenge</p>
      </div>

      <div class="support-content">
        <div class="support-sidebar">
          <mat-card class="glass-panel">
            <mat-card-header>
              <mat-card-title>Help Resources</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="resource-list">
                <a class="resource-item" href="javascript:void(0)">
                  <mat-icon>book</mat-icon>
                  <span>Documentation</span>
                </a>
                <a class="resource-item" href="javascript:void(0)">
                  <mat-icon>play_circle</mat-icon>
                  <span>Video Tutorials</span>
                </a>
                <a class="resource-item" href="javascript:void(0)">
                  <mat-icon>lightbulb</mat-icon>
                  <span>Best Practices</span>
                </a>
                <a class="resource-item" href="javascript:void(0)">
                  <mat-icon>forum</mat-icon>
                  <span>Community Forum</span>
                </a>
                <a class="resource-item" href="javascript:void(0)">
                  <mat-icon>cases</mat-icon>
                  <span>Case Studies</span>
                </a>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="glass-panel contact-card">
            <mat-card-header>
              <mat-card-title>Contact Us</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="contact-item">
                <mat-icon>email</mat-icon>
                <span>support&#64;challengecopilot.com</span>
              </div>
              <div class="contact-item">
                <mat-icon>phone</mat-icon>
                <span>+1 (800) 555-1234</span>
              </div>
              <div class="contact-item">
                <mat-icon>schedule</mat-icon>
                <span>Mon-Fri: 9AM - 5PM EST</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="support-main">
          <mat-card class="glass-panel faq-section">
            <mat-card-header>
              <mat-card-title>Frequently Asked Questions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-accordion>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      How do I create my first challenge?
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>
                    To create your first challenge, navigate to the Dashboard and click on the 
                    "Create Your First Challenge" button. Our AI-assisted wizard will guide you 
                    through the entire process step by step, from defining your problem statement 
                    to configuring prizes and setting up evaluation criteria.
                  </p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      What types of challenges can I create?
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>
                    Our platform supports various types of challenges including:
                  </p>
                  <ul>
                    <li>Ideation challenges for generating new ideas and concepts</li>
                    <li>Development challenges for building functional software solutions</li>
                    <li>Data Science challenges for data analysis and insights</li>
                    <li>Design challenges for visual solutions and UX/UI</li>
                    <li>Research challenges for academic or scientific exploration</li>
                    <li>AI/ML challenges for developing algorithms and models</li>
                  </ul>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      How do I determine the right prize amount?
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>
                    Prize amounts should reflect the complexity of the challenge, required expertise, 
                    and expected effort. Our AI assistant can provide recommendations based on similar 
                    challenges and industry standards. Typically:
                  </p>
                  <ul>
                    <li>Simple ideation challenges: $1,000-$5,000</li>
                    <li>Development challenges: $5,000-$20,000</li>
                    <li>Complex AI/Data Science challenges: $10,000-$50,000+</li>
                  </ul>
                  <p>
                    Consider using milestone prizes or tiered prize structures to encourage broader participation.
                  </p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      How long should my challenge run?
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>
                    Challenge duration depends on complexity:
                  </p>
                  <ul>
                    <li>Ideation challenges: 2-4 weeks</li>
                    <li>Design challenges: 3-6 weeks</li>
                    <li>Development challenges: 6-12 weeks</li>
                    <li>Complex AI/Data Science challenges: 8-16 weeks</li>
                  </ul>
                  <p>
                    Include sufficient time for registration, Q&A, submissions, and evaluation phases.
                  </p>
                </mat-expansion-panel>

                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      What makes a good problem statement?
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <p>
                    A good problem statement should be:
                  </p>
                  <ul>
                    <li>Clear and specific about the problem to be solved</li>
                    <li>Measurable with defined success criteria</li>
                    <li>Challenging but attainable within the timeframe</li>
                    <li>Relevant to participants and your organization</li>
                    <li>Scoped appropriately (not too broad or too narrow)</li>
                  </ul>
                  <p>
                    Use our AI assistant to help refine your problem statement for maximum effectiveness.
                  </p>
                </mat-expansion-panel>
              </mat-accordion>
            </mat-card-content>
          </mat-card>

          <mat-card class="glass-panel support-request-card">
            <mat-card-header>
              <mat-card-title>Request Support</mat-card-title>
              <mat-card-subtitle>Submit a support ticket and our team will respond within 24 hours</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="supportForm" (ngSubmit)="submitSupportRequest()">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="Enter your full name">
                  <mat-error *ngIf="supportForm.get('name')?.hasError('required')">
                    Name is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput formControlName="email" placeholder="Enter your email address">
                  <mat-error *ngIf="supportForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="supportForm.get('email')?.hasError('email')">
                    Please enter a valid email address
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Support Category</mat-label>
                  <mat-select formControlName="category">
                    <mat-option value="challenge-creation">Challenge Creation</mat-option>
                    <mat-option value="account-issues">Account Issues</mat-option>
                    <mat-option value="platform-features">Platform Features</mat-option>
                    <mat-option value="technical-issues">Technical Issues</mat-option>
                    <mat-option value="billing">Billing & Payments</mat-option>
                    <mat-option value="other">Other</mat-option>
                  </mat-select>
                  <mat-error *ngIf="supportForm.get('category')?.hasError('required')">
                    Please select a category
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Challenge ID (if applicable)</mat-label>
                  <input matInput formControlName="challengeId" placeholder="Enter challenge ID if related to a specific challenge">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Subject</mat-label>
                  <input matInput formControlName="subject" placeholder="Brief description of your issue">
                  <mat-error *ngIf="supportForm.get('subject')?.hasError('required')">
                    Subject is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Message</mat-label>
                  <textarea 
                    matInput 
                    formControlName="message" 
                    placeholder="Provide details about your issue or question" 
                    rows="6"></textarea>
                  <mat-error *ngIf="supportForm.get('message')?.hasError('required')">
                    Message is required
                  </mat-error>
                  <mat-hint align="end">{{supportForm.get('message')?.value?.length || 0}}/1000</mat-hint>
                </mat-form-field>

                <div class="form-field checkbox-field">
                  <mat-checkbox formControlName="shareDetails">
                    Allow support to access my challenge details to better assist me
                  </mat-checkbox>
                </div>

                <div class="form-actions">
                  <button 
                    mat-flat-button
                    class="neon-button" 
                    type="submit"
                    [disabled]="supportForm.invalid">
                    Submit Request
                  </button>
                  <button 
                    mat-stroked-button 
                    type="button"
                    (click)="resetForm()">
                    Reset
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      position: relative;
      min-height: calc(100vh - 64px);
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
    
    .page-header {
      margin-bottom: 2rem;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      padding: 2rem;
      box-shadow: var(--shadow-sm);
      border: var(--border-light);
      position: relative;
      overflow: hidden;
    }
    
    .page-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--accent-purple), var(--secondary-500));
    }
    
    .page-header h1 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 2.2rem;
      letter-spacing: -0.02em;
      display: inline-block;
    }
    
    .subtitle {
      color: var(--text-secondary);
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }
    
    .support-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
    }
    
    @media (max-width: 768px) {
      .support-content {
        grid-template-columns: 1fr;
      }
    }
    
    .support-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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
      transform: translateY(-5px);
      box-shadow: var(--shadow-primary) !important;
    }
    
    .resource-list {
      display: flex;
      flex-direction: column;
      padding: 0.5rem 0;
    }
    
    .resource-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0.8rem;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 0.25rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border-left: 3px solid transparent;
      z-index: 1;
    }
    
    .resource-item::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.1), rgba(var(--primary-rgb), 0.05));
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }
    
    .resource-item:hover {
      border-left-color: var(--primary-500);
      transform: translateX(5px);
    }
    
    .resource-item:hover::after {
      opacity: 1;
    }
    
    .resource-item mat-icon {
      color: var(--primary-600);
      background: rgba(157, 120, 255, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7px;
    }
    
    .contact-card {
      margin-top: 1rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1rem 0;
      padding: 0.8rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      color: var(--text-primary);
    }
    
    .contact-item:hover {
      background: rgba(157, 120, 255, 0.05);
      transform: translateX(5px);
    }
    
    .contact-item mat-icon {
      color: var(--primary-600);
      background: rgba(157, 120, 255, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 7px;
    }
    
    .faq-section {
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      padding-top: 1.5rem !important;
    }
    
    .faq-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--accent-info));
      z-index: 1;
    }
    
    .faq-section mat-card-header {
      padding-left: 1rem;
      margin-bottom: 1rem;
    }
    
    .faq-section mat-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .support-main {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .support-request-card {
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      padding-top: 1.5rem !important;
    }
    
    .support-request-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink));
      z-index: 1;
    }
    
    .support-request-card mat-card-header {
      padding-left: 1rem;
      margin-bottom: 1rem;
    }
    
    .support-request-card mat-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .support-request-card mat-card-subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    /* Fix for the expansion panel issues with transparency */
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
    
    /* Enhanced Form Styles */
    .full-width {
      width: 100%;
    }
    
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: var(--border-light) !important;
    }
    
    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline {
      color: var(--primary-500) !important;
    }
    
    ::ng-deep .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick {
      color: var(--primary-500) !important;
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
    
    .form-field {
      margin-bottom: 1rem;
    }
    
    .checkbox-field {
      margin: 1.5rem 0;
    }
    
    ::ng-deep .mat-checkbox-checked .mat-checkbox-background {
      background-color: var(--primary-600) !important;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .form-actions button {
      min-width: 120px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
    
    .form-actions button[type="button"] {
      border: 1px solid var(--primary-400) !important;
      color: var(--primary-600) !important;
    }
    
    .form-actions button[type="button"]:hover {
      background-color: rgba(157, 120, 255, 0.05) !important;
      transform: translateY(-3px);
    }
    
    ul {
      color: var(--text-secondary);
      margin-left: 1.5rem;
      padding-left: 0;
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
  `]
})
export class SupportComponent {
  supportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      category: ['challenge-creation', Validators.required],
      challengeId: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(1000)]],
      shareDetails: [true]
    });
  }

  submitSupportRequest(): void {
    if (this.supportForm.invalid) {
      return;
    }

    // In a real application, this would send the support request to a backend API
    console.log('Support request submitted:', this.supportForm.value);

    // Show success message
    this.snackBar.open(
      'Your support request has been submitted successfully. Our team will respond within 24 hours.',
      'Close',
      { duration: 5000 }
    );

    // Reset form after submission
    this.resetForm();
  }

  resetForm(): void {
    this.supportForm.reset({
      category: 'challenge-creation',
      shareDetails: true
    });
  }
}