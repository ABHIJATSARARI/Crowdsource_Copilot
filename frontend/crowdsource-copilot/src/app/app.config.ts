import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { reducers, metaReducers } from './state/reducers';
import { AppEffects } from './state/effects';
import { ThemeService } from './core/services/theme.service';

// Factory function to initialize theme safely
function initializeThemeFactory(themeService: ThemeService) {
  return () => {
    // ThemeService will safely check for browser environment
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideStore(reducers, { metaReducers }),
    provideEffects(AppEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
    // Theme initialization
    {
      provide: APP_INITIALIZER,
      useFactory: initializeThemeFactory,
      deps: [ThemeService],
      multi: true
    }
  ]
};
