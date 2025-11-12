import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([{ path: '', component: DashboardComponent }]),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
