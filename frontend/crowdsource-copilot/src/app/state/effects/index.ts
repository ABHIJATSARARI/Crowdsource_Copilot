import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}
}