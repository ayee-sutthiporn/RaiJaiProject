import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { APP_INITIALIZER } from '@angular/core';

/**
 * เราเปลี่ยนให้ initService ทำงานแบบ Non-blocking (ไม่ต้อง await)
 * เพื่อให้ App สามารถ Render หน้า loading (AppComponent) ได้ทันที
 * โดย AuthGuard จะเป็นตัวรอ (await ensureInitialized) แทน
 */
function initializeAuth(authService: AuthService) {
  return () => {
    authService.initService();
    // ไม่ต้อง return Promise เพื่อให้ App Bootstrap ได้เลย
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
