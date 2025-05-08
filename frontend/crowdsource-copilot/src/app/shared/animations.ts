import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  stagger, 
  animation, 
  useAnimation,
  state,
  group,
  keyframes
} from '@angular/animations';

// Reusable animations
const fadeIn = animation([
  style({ opacity: 0 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ opacity: 1 }))
], {
  params: {
    duration: 400,
    delay: 0,
    easing: 'ease-in-out'
  }
});

const fadeOut = animation([
  style({ opacity: 1 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ opacity: 0 }))
], {
  params: {
    duration: 300,
    delay: 0,
    easing: 'ease-in-out'
  }
});

const slideInUp = animation([
  style({ transform: 'translateY({{distance}}px)', opacity: 0 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ transform: 'translateY(0)', opacity: 1 }))
], {
  params: {
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
    distance: 30
  }
});

const slideInRight = animation([
  style({ transform: 'translateX({{distance}}px)', opacity: 0 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ transform: 'translateX(0)', opacity: 1 }))
], {
  params: {
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
    distance: 30
  }
});

const slideInLeft = animation([
  style({ transform: 'translateX(-{{distance}}px)', opacity: 0 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ transform: 'translateX(0)', opacity: 1 }))
], {
  params: {
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
    distance: 30
  }
});

const zoomIn = animation([
  style({ transform: 'scale(0.95)', opacity: 0 }),
  animate('{{duration}}ms {{delay}}ms {{easing}}', style({ transform: 'scale(1)', opacity: 1 }))
], {
  params: {
    duration: 400,
    delay: 0,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
});

const bounceIn = animation([
  animate('{{duration}}ms {{delay}}ms', keyframes([
    style({ opacity: 0, transform: 'scale(0.8)', offset: 0 }),
    style({ opacity: 0.5, transform: 'scale(1.05)', offset: 0.5 }),
    style({ opacity: 1, transform: 'scale(0.98)', offset: 0.7 }),
    style({ opacity: 1, transform: 'scale(1)', offset: 1.0 })
  ]))
], {
  params: {
    duration: 600,
    delay: 0
  }
});

// Page transitions
export const pageTransitions = trigger('pageTransitions', [
  transition(':enter', [
    useAnimation(fadeIn, { params: { duration: 600 } })
  ]),
  transition(':leave', [
    useAnimation(fadeOut, { params: { duration: 400 } })
  ])
]);

// Slide-in stagger for lists
export const listStagger = trigger('listStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('50ms', [
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

// Card hover animation
export const cardHover = trigger('cardHover', [
  state('default', style({
    transform: 'translateY(0)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  })),
  state('hover', style({
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  })),
  transition('default => hover', animate('250ms ease-out')),
  transition('hover => default', animate('200ms ease-in'))
]);

// Fade/slide transitions for content regions
export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    useAnimation(slideInUp)
  ])
]);

export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    useAnimation(slideInRight)
  ])
]);

export const fadeInLeft = trigger('fadeInLeft', [
  transition(':enter', [
    useAnimation(slideInLeft)
  ])
]);

export const fadeInContent = trigger('fadeInContent', [
  transition(':enter', [
    useAnimation(fadeIn, { params: { duration: 500 } })
  ])
]);

export const zoomInContent = trigger('zoomInContent', [
  transition(':enter', [
    useAnimation(zoomIn, { params: { duration: 500 } })
  ])
]);

export const bounceInContent = trigger('bounceInContent', [
  transition(':enter', [
    useAnimation(bounceIn)
  ])
]);

// Stepper/wizard animations
export const stepTransition = trigger('stepTransition', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' }),
      animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ], { optional: true }),
    query(':leave', [
      animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
    ], { optional: true })
  ])
]);

// Value change animations (for dynamic content)
export const valueChanged = trigger('valueChanged', [
  transition('* => *', [
    style({ opacity: 0.7, transform: 'scale(0.95)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

// Accordion/expansion panel animations
export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({
    height: '0px',
    opacity: 0,
    overflow: 'hidden'
  })),
  state('expanded', style({
    height: '*',
    opacity: 1
  })),
  transition('expanded <=> collapsed', [
    animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ])
]);

// Menu animations
export const menuAnimation = trigger('menuAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
  ])
]);

// Modal/dialog animations
export const modalAnimation = trigger('modalAnimation', [
  transition(':enter', [
    group([
      query('.modal-backdrop', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 }))
      ], { optional: true }),
      query('.modal-content', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' }),
        animate('300ms 50ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
            style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ], { optional: true })
    ])
  ]),
  transition(':leave', [
    group([
      query('.modal-backdrop', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query('.modal-content', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' }))
      ], { optional: true })
    ])
  ])
]);

// Shake animation (for form validation errors or notifications)
export const shakeAnimation = trigger('shakeAnimation', [
  transition('* => shake', [
    animate('600ms ease-in-out', keyframes([
      style({ transform: 'translateX(0)', offset: 0 }),
      style({ transform: 'translateX(-10px)', offset: 0.1 }),
      style({ transform: 'translateX(10px)', offset: 0.3 }),
      style({ transform: 'translateX(-10px)', offset: 0.5 }),
      style({ transform: 'translateX(8px)', offset: 0.7 }),
      style({ transform: 'translateX(-5px)', offset: 0.9 }),
      style({ transform: 'translateX(0)', offset: 1 })
    ]))
  ])
]);

// Pulse animation (for highlighting)
export const pulseAnimation = trigger('pulseAnimation', [
  transition('* => pulse', [
    animate('500ms ease-in-out', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.08)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);

// Icon rotate animation
export const rotateAnimation = trigger('rotateAnimation', [
  state('default', style({ transform: 'rotate(0deg)' })),
  state('rotated', style({ transform: 'rotate(180deg)' })),
  transition('default <=> rotated', animate('300ms ease-out'))
]);

// Notification slide-in
export const notificationAnimation = trigger('notificationAnimation', [
  // Slide in from right
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  // Slide out to right
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
  ])
]);

// Route transition animations
export const routeTransitions = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('300ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

// Additional animations needed by the wizard components
export const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
  ])
]);

export const fadeInAnimation = trigger('fadeInAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0 }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger('100ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const slideInAnimation = trigger('slideInAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(30px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateX(30px)', opacity: 0 }))
  ])
]);