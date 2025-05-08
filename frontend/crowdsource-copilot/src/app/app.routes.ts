import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'wizard', 
    loadComponent: () => import('./features/wizard/wizard.component').then(m => m.WizardComponent),
    children: [
      { path: '', redirectTo: 'step1', pathMatch: 'full' },
      { path: 'step1', loadComponent: () => import('./features/wizard/step1/step1.component').then(m => m.Step1Component) },
      { path: 'step2', loadComponent: () => import('./features/wizard/step2/step2.component').then(m => m.Step2Component) },
      { path: 'step3', loadComponent: () => import('./features/wizard/step3/step3.component').then(m => m.Step3Component) },
      { path: 'step4', loadComponent: () => import('./features/wizard/step4/step4.component').then(m => m.Step4Component) },
      { path: 'step5', loadComponent: () => import('./features/wizard/step5/step5.component').then(m => m.Step5Component) },
      { path: 'step6', loadComponent: () => import('./features/wizard/step6/step6.component').then(m => m.Step6Component) },
      { path: 'step7', loadComponent: () => import('./features/wizard/step7/step7.component').then(m => m.Step7Component) }
    ]
  },
  { 
    path: 'ai-assistant', 
    loadComponent: () => import('./features/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent) 
  },
  { 
    path: 'support', 
    loadComponent: () => import('./features/support/support.component').then(m => m.SupportComponent) 
  },
  { path: '**', redirectTo: '/dashboard' }
];
