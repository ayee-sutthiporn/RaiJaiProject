import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);

    if (authService.isLoggedIn) {
        return true;
    }

    const ssoChecked = sessionStorage.getItem('sso_checked');
    const now = Date.now();

    if (!ssoChecked || (now - parseInt(ssoChecked, 10) > 30000)) {
        sessionStorage.setItem('sso_checked', now.toString());
        await authService.login({ prompt: 'none' });
        return false;
    }

    sessionStorage.removeItem('sso_checked');
    window.location.href = 'https://portal.sutthiporn.dev';
    return false;
};