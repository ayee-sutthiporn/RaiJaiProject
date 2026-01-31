import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { DataService } from './core/services/data.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  dataService = inject(DataService);
  protected readonly title = signal('Frontend_RaiJai');

  constructor() {
    // Load data when user is authenticated
    effect(() => {
      if (this.authService.hasValidAccessToken() && !this.authService.isAuthChecking()) {
        this.dataService.loadAllData();
      }
    });
  }
}
