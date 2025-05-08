import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AiService } from '../../../core/services/ai.service';

interface FileFormat {
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-step3',
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
    MatCheckboxModule,
    MatTooltipModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="step-container">
      <h2>Submission Requirements</h2>
      <p class="subtitle">Define what participants need to submit for your challenge</p>
      
      <form [formGroup]="submissionForm">
        <!-- Submission Type -->
        <div class="form-section">
          <h3>Submission Type</h3>
          
          <div class="form-field">
            <mat-radio-group formControlName="submissionType" class="radio-group">
              <mat-radio-button value="single" color="primary">
                Single Submission
              </mat-radio-button>
              <mat-radio-button value="multiple" color="primary">
                Multiple Submissions
              </mat-radio-button>
              <mat-radio-button value="phased" color="primary">
                Phased Submissions
              </mat-radio-button>
            </mat-radio-group>
          </div>
          
          <div class="form-field" *ngIf="submissionForm.get('submissionType')?.value === 'multiple'">
            <mat-form-field appearance="outline">
              <mat-label>Maximum Submissions per Participant</mat-label>
              <input matInput type="number" min="1" formControlName="maxSubmissions">
              <mat-hint>Set a reasonable limit based on evaluation capacity</mat-hint>
            </mat-form-field>
          </div>
          
          <div class="form-field" *ngIf="submissionForm.get('submissionType')?.value === 'phased'">
            <mat-card class="info-card">
              <mat-card-content>
                <div class="info-card-content">
                  <mat-icon color="primary">info</mat-icon>
                  <span>
                    Phased submissions require participants to submit deliverables at different stages.
                    You'll define these phases in the Timeline step.
                  </span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
        
        <!-- Required Files -->
        <div class="form-section">
          <h3>Required Files</h3>
          <p class="section-description">Specify which file types participants must submit</p>
          
          <div class="file-format-grid">
            <mat-card 
              *ngFor="let format of fileFormats" 
              class="file-format-card"
              [class.selected]="isFileFormatSelected(format.name)"
              (click)="toggleFileFormat(format.name)">
              <mat-card-content>
                <div class="file-format-icon">
                  <mat-icon>{{ format.icon }}</mat-icon>
                </div>
                <div class="file-format-name">{{ format.name }}</div>
                <div class="file-format-desc">{{ format.description }}</div>
                <mat-checkbox 
                  [checked]="isFileFormatSelected(format.name)"
                  (change)="$event ? toggleFileFormat(format.name) : null"
                  (click)="$event.stopPropagation()" 
                  color="primary">
                </mat-checkbox>
              </mat-card-content>
            </mat-card>
          </div>
          
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Other File Types (Optional)</mat-label>
              <input matInput formControlName="otherFileTypes" placeholder="e.g., .stl, .obj, custom formats">
              <mat-hint>Enter additional file formats separated by commas</mat-hint>
            </mat-form-field>
          </div>
          
          <div class="form-field">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Maximum File Size (MB)</mat-label>
              <input matInput type="number" min="1" formControlName="maxFileSize">
              <mat-hint>Recommended: 50-100MB per file for most challenges</mat-hint>
            </mat-form-field>
          </div>
        </div>
        
        <!-- Documentation Requirements -->
        <div class="form-section">
          <h3>Documentation Requirements</h3>
          <p class="section-description">Specify what documentation participants must include</p>
          
          <div formArrayName="documentationRequirements" class="documentation-requirements">
            <div *ngFor="let requirement of documentationRequirementsArray.controls; let i = index" class="form-field">
              <div [formGroupName]="i" class="documentation-requirement-item">
                <mat-checkbox formControlName="required" color="primary"></mat-checkbox>
                <mat-form-field appearance="outline" class="requirement-name">
                  <mat-label>Requirement Name</mat-label>
                  <input matInput formControlName="name">
                </mat-form-field>
                <mat-form-field appearance="outline" class="requirement-description">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="2"></textarea>
                </mat-form-field>
                <button mat-icon-button color="warn" (click)="removeDocumentationRequirement(i)" type="button">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              <mat-divider *ngIf="i < documentationRequirementsArray.controls.length - 1"></mat-divider>
            </div>
            
            <div class="add-button-container">
              <button mat-stroked-button color="primary" type="button" (click)="addDocumentationRequirement()">
                <mat-icon>add</mat-icon> Add Documentation Requirement
              </button>
            </div>
          </div>
        </div>
        
        <!-- Submission Templates -->
        <div class="form-section">
          <h3>Submission Templates</h3>
          <p class="section-description">Provide templates to help guide participants (Optional)</p>
          
          <div class="form-field">
            <mat-checkbox formControlName="provideTemplates" color="primary">
              Provide submission templates
            </mat-checkbox>
            <p class="helper-text">
              Templates help ensure consistent submissions and improve evaluation quality
            </p>
          </div>
          
          <div *ngIf="submissionForm.get('provideTemplates')?.value" class="template-section">
            <div formArrayName="submissionTemplates" class="template-list">
              <div *ngFor="let template of templatesArray.controls; let i = index" class="template-item-container">
                <div [formGroupName]="i" class="template-item">
                  <mat-form-field appearance="outline">
                    <mat-label>Template Name</mat-label>
                    <input matInput formControlName="name" placeholder="e.g., Project Documentation">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>File Format</mat-label>
                    <mat-select formControlName="format">
                      <mat-option value="docx">.docx</mat-option>
                      <mat-option value="xlsx">.xlsx</mat-option>
                      <mat-option value="pptx">.pptx</mat-option>
                      <mat-option value="pdf">.pdf</mat-option>
                      <mat-option value="code">Code template</mat-option>
                      <mat-option value="other">Other</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div class="template-actions">
                    <button mat-stroked-button color="primary" type="button">
                      <mat-icon>upload</mat-icon> Upload
                    </button>
                    <button mat-icon-button color="warn" type="button" (click)="removeTemplate(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                <mat-divider *ngIf="i < templatesArray.controls.length - 1"></mat-divider>
              </div>
            </div>
            
            <div class="add-button-container">
              <button mat-stroked-button color="primary" type="button" (click)="addTemplate()">
                <mat-icon>add</mat-icon> Add Template
              </button>
            </div>
          </div>
        </div>
        
        <!-- AI Assistant for Submission Guidelines -->
        <div class="form-section">
          <h3>Generate Submission Guidelines</h3>
          <p class="section-description">Use AI to help you create clear submission guidelines</p>
          
          <mat-card class="ai-card">
            <mat-card-content>
              <div class="ai-header">
                <mat-icon color="accent">psychology</mat-icon>
                <span>AI Assistant</span>
              </div>
              
              <div class="ai-content">
                <p>Let me generate detailed submission guidelines based on your requirements</p>
                
                <div class="ai-form">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Additional Context (Optional)</mat-label>
                    <textarea 
                      matInput 
                      [(ngModel)]="aiGuidelinesContext"
                      [ngModelOptions]="{standalone: true}"
                      rows="3"
                      placeholder="Add any specific requirements or expectations for submissions"></textarea>
                  </mat-form-field>
                </div>
                
                <div class="ai-actions">
                  <button 
                    mat-raised-button 
                    color="accent" 
                    (click)="generateSubmissionGuidelines()" 
                    [disabled]="isGeneratingGuidelines">
                    <mat-icon>auto_awesome</mat-icon>
                    Generate Guidelines
                  </button>
                  <mat-spinner *ngIf="isGeneratingGuidelines" diameter="24"></mat-spinner>
                </div>
              </div>
              
              <div *ngIf="generatedGuidelines" class="generated-content">
                <mat-divider></mat-divider>
                <h4>Generated Submission Guidelines</h4>
                <div class="guidelines-preview">{{ generatedGuidelines }}</div>
                <div class="guidelines-actions">
                  <button mat-button color="primary" (click)="useGuidelines()">
                    <mat-icon>check</mat-icon> Use These Guidelines
                  </button>
                  <button mat-button (click)="regenerateGuidelines()">
                    <mat-icon>refresh</mat-icon> Regenerate
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          
          <div class="form-field" *ngIf="submissionForm.get('submissionGuidelines')?.value">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Submission Guidelines</mat-label>
              <textarea 
                matInput 
                formControlName="submissionGuidelines"
                rows="6"></textarea>
              <mat-hint>These guidelines will be shown to participants during submission</mat-hint>
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
    
    .subtitle, .section-description {
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
    
    .info-card {
      background-color: rgba(var(--primary-rgb), 0.05);
      border-radius: var(--border-radius);
      margin: 12px 0;
      border: 1px solid rgba(var(--primary-rgb), 0.1);
    }
    
    .info-card-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      color: var(--text-primary);
    }
    
    .file-format-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .file-format-card {
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      height: 100%;
      background: var(--bg-card);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      border: var(--border-light);
    }
    
    .file-format-card.selected {
      border: 2px solid var(--primary-500);
      background-color: rgba(var(--primary-rgb), 0.04);
      box-shadow: var(--shadow-primary);
    }
    
    .file-format-card mat-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    
    .file-format-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
      color: var(--primary-600);
    }
    
    .file-format-icon mat-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
    }
    
    .file-format-name {
      font-weight: 500;
      text-align: center;
      margin-bottom: 4px;
      color: var(--text-primary);
    }
    
    .file-format-desc {
      font-size: 12px;
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .documentation-requirements {
      margin-top: 16px;
    }
    
    .documentation-requirement-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .requirement-name {
      flex: 1;
    }
    
    .requirement-description {
      flex: 2;
    }
    
    .add-button-container {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    
    .template-section {
      margin-top: 16px;
      margin-left: 32px;
    }
    
    .template-item-container {
      margin-bottom: 16px;
    }
    
    .template-item {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }
    
    .template-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .helper-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
      margin-left: 34px;
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
    
    .generated-content {
      margin-top: 20px;
      padding-top: 16px;
      position: relative;
    }
    
    .guidelines-preview {
      background: rgba(var(--primary-rgb), 0.04);
      padding: 16px;
      border-radius: var(--border-radius);
      margin: 12px 0;
      white-space: pre-line;
      border: 1px solid rgba(var(--primary-rgb), 0.1);
      color: var(--text-primary);
    }
    
    .guidelines-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
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
      .template-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .template-actions {
        margin-top: 12px;
      }

      .documentation-requirement-item {
        flex-wrap: wrap;
      }

      .requirement-description {
        flex: 1 1 100%;
        margin-left: 34px;
      }
    }
  `]
})
export class Step3Component implements OnInit {
  submissionForm: FormGroup;
  fileFormats: FileFormat[] = [
    { name: 'PDF', description: 'Documents & Reports', icon: 'picture_as_pdf' },
    { name: 'Image', description: 'JPG, PNG, etc.', icon: 'image' },
    { name: 'Video', description: 'MP4, AVI, etc.', icon: 'videocam' },
    { name: 'Spreadsheet', description: 'Excel, CSV', icon: 'table_chart' },
    { name: 'Presentation', description: 'PowerPoint, etc.', icon: 'slideshow' },
    { name: 'Source Code', description: 'ZIP, GitHub, etc.', icon: 'code' },
    { name: 'Dataset', description: 'Data files', icon: 'database' },
    { name: 'Design', description: 'PSD, AI, etc.', icon: 'brush' }
  ];
  
  selectedFileFormats: string[] = ['PDF', 'Source Code'];
  
  aiGuidelinesContext = '';
  generatedGuidelines: string | null = null;
  isGeneratingGuidelines = false;
  
  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.submissionForm = this.fb.group({
      submissionType: ['single', Validators.required],
      maxSubmissions: [3],
      selectedFileFormats: [this.selectedFileFormats],
      otherFileTypes: [''],
      maxFileSize: [50, [Validators.required, Validators.min(1)]],
      provideTemplates: [false],
      documentationRequirements: this.fb.array([]),
      submissionTemplates: this.fb.array([]),
      submissionGuidelines: ['']
    });
    
    // Add some default documentation requirements
    this.addDocumentationRequirement('README', 'Explanation of how to use/run the submission', true);
    this.addDocumentationRequirement('Technical Documentation', 'Details of the solution architecture and implementation', true);
    this.addDocumentationRequirement('Installation Instructions', 'Step-by-step guide to set up the solution', false);
  }
  
  ngOnInit(): void {
    // Load saved data from state management if available
    // This would be implemented with NgRx
  }
  
  get documentationRequirementsArray() {
    return this.submissionForm.get('documentationRequirements') as FormArray;
  }
  
  get templatesArray() {
    return this.submissionForm.get('submissionTemplates') as FormArray;
  }
  
  isFileFormatSelected(formatName: string): boolean {
    return this.selectedFileFormats.includes(formatName);
  }
  
  toggleFileFormat(formatName: string): void {
    if (this.isFileFormatSelected(formatName)) {
      this.selectedFileFormats = this.selectedFileFormats.filter(f => f !== formatName);
    } else {
      this.selectedFileFormats.push(formatName);
    }
    
    // Update form control value
    this.submissionForm.get('selectedFileFormats')?.setValue([...this.selectedFileFormats]);
  }
  
  addDocumentationRequirement(name = '', description = '', required = false): void {
    const requirementGroup = this.fb.group({
      name: [name, Validators.required],
      description: [description],
      required: [required]
    });
    
    this.documentationRequirementsArray.push(requirementGroup);
  }
  
  removeDocumentationRequirement(index: number): void {
    this.documentationRequirementsArray.removeAt(index);
  }
  
  addTemplate(): void {
    const templateGroup = this.fb.group({
      name: ['', Validators.required],
      format: ['docx', Validators.required],
      filePath: [''] // This would store the uploaded file path in a real implementation
    });
    
    this.templatesArray.push(templateGroup);
  }
  
  removeTemplate(index: number): void {
    this.templatesArray.removeAt(index);
  }
  
  generateSubmissionGuidelines(): void {
    this.isGeneratingGuidelines = true;
    
    const formValues = this.submissionForm.value;
    
    // Build a prompt based on the form values
    const prompt = `
      Create detailed submission guidelines for an innovation challenge with these requirements:
      
      Submission Type: ${formValues.submissionType}
      ${formValues.submissionType === 'multiple' ? 'Maximum Submissions: ' + formValues.maxSubmissions : ''}
      
      Required File Types: ${this.selectedFileFormats.join(', ')}
      ${formValues.otherFileTypes ? 'Other File Types: ' + formValues.otherFileTypes : ''}
      Maximum File Size: ${formValues.maxFileSize}MB
      
      Documentation Requirements:
      ${this.documentationRequirementsArray.controls.map((control: any) => {
        const req = control.value;
        return `- ${req.name}: ${req.description} ${req.required ? '(Required)' : '(Optional)'}`;
      }).join('\n')}
      
      ${this.aiGuidelinesContext ? 'Additional Context: ' + this.aiGuidelinesContext : ''}
      
      Format the guidelines in a clear, well-structured way with headings, bullet points, 
      and any specific instructions participants need to follow.
    `;
    
    this.aiService.getRecommendation(prompt).subscribe(
      (response) => {
        this.generatedGuidelines = response;
        this.isGeneratingGuidelines = false;
      },
      (error) => {
        console.error('Error generating submission guidelines:', error);
        this.isGeneratingGuidelines = false;
      }
    );
  }
  
  useGuidelines(): void {
    if (this.generatedGuidelines) {
      this.submissionForm.get('submissionGuidelines')?.setValue(this.generatedGuidelines);
      this.generatedGuidelines = null; // Clear the preview
    }
  }
  
  regenerateGuidelines(): void {
    this.generateSubmissionGuidelines(); // Just call the generate method again
  }
}