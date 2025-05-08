import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';

interface Challenge {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  type: string;
  tags: string[];
  startDate?: Date;
  endDate?: Date;
  participants?: number;
  submissionCount?: number;
  progress?: number;
  summary?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
    MatRippleModule,
    AiAssistantComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('cardEnter', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('600ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
    trigger('staggeredFade', [
      state('void', style({ 
        opacity: 0, 
        transform: 'translateY(10px)' 
      })),
      transition('void => *', [
        animate('{{delay}}ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateY(0)' 
        })),
      ]),
    ]),
  ]
})
export class DashboardComponent implements OnInit {
  challenges: Challenge[] = [];
  myChallenges: Challenge[] = [];
  exploreChallenges: Challenge[] = [];
  recentActivity: any[] = [];
  projectCount = 0;
  taskCount = 0;
  contributorCount = 0;
  isNewUser = false;
  stats = [
    { label: 'Contributions', value: 247, icon: 'construction', trend: '+12%', isUp: true },
    { label: 'Rank', value: 34, icon: 'emoji_events', trend: '+5', isUp: true },
    { label: 'Points', value: 1250, icon: 'stars', trend: '+25', isUp: true },
    { label: 'Accuracy', value: '92%', icon: 'analytics', trend: '+2%', isUp: true }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSampleChallenges();
    this.initializeDashboardData();
  }

  initializeDashboardData(): void {
    // Initialize counts
    this.projectCount = this.challenges.length;
    this.taskCount = this.challenges.reduce((sum, challenge) => sum + (challenge.submissionCount || 0), 0);
    this.contributorCount = this.getTotalParticipants();

    // Assign challenges to categories
    this.myChallenges = [...this.challenges];
    this.exploreChallenges = []; // In a real app, this would be populated with different data
    
    // Sample activity data
    this.recentActivity = [
      {
        icon: 'add_circle',
        title: 'New Challenge Created',
        description: 'You created "AI Solution for Supply Chain Optimization"',
        timestamp: new Date(2025, 4, 5)
      },
      {
        icon: 'person_add',
        title: 'New Contributor',
        description: 'Alex Johnson joined your "Mobile App for Urban Waste Management" challenge',
        timestamp: new Date(2025, 4, 3)
      },
      {
        icon: 'upload_file',
        title: 'New Submission',
        description: 'New submission for "Data Visualization for Climate Impact"',
        timestamp: new Date(2025, 4, 1)
      }
    ];
  }

  startNewChallenge(): void {
    this.router.navigate(['/wizard']);
  }

  showTutorial(): void {
    console.log('Show tutorial');
  }

  viewChallenge(challenge: Challenge): void {
    console.log(`View challenge with id: ${challenge.id}`);
  }

  editChallenge(challenge: Challenge): void {
    this.router.navigate(['/wizard'], { queryParams: { id: challenge.id } });
  }

  manageChallenge(id: string): void {
    console.log(`Manage challenge with id: ${id}`);
  }

  duplicateChallenge(id: string): void {
    console.log(`Duplicate challenge with id: ${id}`);
  }

  exportChallenge(id: string): void {
    console.log(`Export challenge with id: ${id}`);
  }

  deleteChallenge(challenge: Challenge): void {
    this.challenges = this.challenges.filter(c => c.id !== challenge.id);
    this.myChallenges = this.myChallenges.filter(c => c.id !== challenge.id);
    this.projectCount = this.challenges.length;
  }

  getActiveCount(): number {
    return this.challenges.filter(c => c.status === 'active').length;
  }

  getDraftCount(): number {
    return this.challenges.filter(c => c.status === 'draft').length;
  }

  getCompletedCount(): number {
    return this.challenges.filter(c => c.status === 'completed').length;
  }

  getTotalParticipants(): number {
    return this.challenges.reduce((sum, challenge) => sum + (challenge.participants || 0), 0);
  }

  getTotalSubmissions(): number {
    return this.challenges.reduce((sum, challenge) => sum + (challenge.submissionCount || 0), 0);
  }

  getFilteredChallenges(status: string): Challenge[] {
    return this.challenges.filter(c => c.status === status);
  }

  getProgressColor(progress: number | undefined): 'primary' | 'accent' | 'warn' {
    if (!progress) return 'primary';
    if (progress < 30) return 'warn';
    if (progress < 70) return 'accent';
    return 'primary';
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getChallengeIcon(type: string): string {
    return this.getChallengeTypeIcon(type);
  }

  getChallengeTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'ideation':
        return 'lightbulb';
      case 'development':
        return 'code';
      case 'data-science':
        return 'insights';
      case 'design':
        return 'brush';
      case 'research':
        return 'science';
      case 'ai':
        return 'psychology';
      default:
        return 'extension';
    }
  }

  getStatusClass(status: string): string {
    return status === 'in-progress' ? 'status-progress' : 
           status === 'completed' ? 'status-success' : 
           status === 'failed' ? 'status-error' : 'status-new';
  }

  getCardClass(index: number): string {
    const baseClass = 'challenge-card expanding-card';
    if (index % 3 === 0) return `${baseClass} border-animation`;
    if (index % 3 === 1) return `${baseClass} tilt-card`;
    return `${baseClass} card-stack`;
  }

  getAnimationDelay(index: number): any {
    return { 
      value: '', // This can be any string, just a placeholder
      params: { delay: 100 * (index + 1) } 
    };
  }
  
  // Add missing methods used in the template
  createNewProject(): void {
    this.router.navigate(['/wizard']);
  }
  
  inviteContributors(): void {
    console.log('Invite contributors dialog would open here');
  }
  
  viewReports(): void {
    console.log('Navigate to reports page');
  }

  private loadSampleChallenges(): void {
    this.challenges = [
      {
        id: '1',
        title: 'AI Solution for Supply Chain Optimization',
        status: 'active',
        type: 'ai',
        tags: ['artificial-intelligence', 'supply-chain', 'optimization'],
        startDate: new Date(2025, 4, 1),
        endDate: new Date(2025, 6, 15),
        participants: 24,
        submissionCount: 8,
        progress: 45,
        summary: 'Create AI algorithms to optimize supply chain operations with focus on predictive inventory management and route optimization.'
      },
      {
        id: '2',
        title: 'Mobile App for Urban Waste Management',
        status: 'draft',
        type: 'development',
        tags: ['mobile-app', 'waste-management', 'urban-solutions'],
        summary: 'Develop a mobile application to help citizens report and track urban waste issues, enabling more efficient municipal waste management.'
      },
      {
        id: '3',
        title: 'Data Visualization for Climate Impact',
        status: 'completed',
        type: 'data-science',
        tags: ['visualization', 'climate-change', 'data-analysis'],
        startDate: new Date(2025, 1, 10),
        endDate: new Date(2025, 3, 25),
        participants: 18,
        submissionCount: 15,
        summary: 'Create interactive dashboards to visualize climate change impact using real-world data sets from multiple global sources.'
      },
      {
        id: '4',
        title: 'Digital Inclusion Platform Design',
        status: 'active',
        type: 'design',
        tags: ['ui-ux', 'accessibility', 'inclusion'],
        startDate: new Date(2025, 3, 5),
        endDate: new Date(2025, 5, 30),
        participants: 12,
        submissionCount: 5,
        progress: 70,
        summary: 'Design a digital platform focused on accessibility and inclusion that works across different devices and for users with diverse needs.'
      },
      {
        id: '5',
        title: 'Sustainable Food Packaging Innovation',
        status: 'draft',
        type: 'ideation',
        tags: ['sustainability', 'packaging', 'food'],
        summary: 'Propose innovative concepts for sustainable food packaging that reduces environmental impact while maintaining food safety standards.'
      },
      {
        id: '6',
        title: 'Healthcare Data Privacy Framework',
        status: 'active',
        type: 'research',
        tags: ['healthcare', 'data-privacy', 'security'],
        startDate: new Date(2025, 2, 15),
        endDate: new Date(2025, 5, 15),
        participants: 14,
        submissionCount: 6,
        progress: 30,
        summary: 'Develop a comprehensive framework for managing patient data privacy while enabling necessary data sharing for healthcare research.'
      }
    ];
  }
}