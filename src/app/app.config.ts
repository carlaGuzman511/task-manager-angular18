import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: DashboardComponent }
    ]),
    provideAnimations()
  ]
};