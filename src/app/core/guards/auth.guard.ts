import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);

    console.log('[AuthGuard] Checking Token...');
    if (authService.isLoggedIn) {
        console.log('[AuthGuard] User is logged in. Clearing sso_checked.');
        sessionStorage.removeItem('sso_checked');
        return true;
    }

    const ssoChecked = sessionStorage.getItem('sso_checked');
    const now = Date.now();
    console.log('[AuthGuard] Not logged in. sso_checked:', ssoChecked);

    if (!ssoChecked || (now - parseInt(ssoChecked, 10) > 30000)) {
        console.log('[AuthGuard] Starting login flow (first try or timeout).');
        sessionStorage.setItem('sso_checked', now.toString());
        await authService.login();
        return false;
    }

    console.log('[AuthGuard] Login flow already attempted. Redirecting to Portal.');
    sessionStorage.removeItem('sso_checked');
    window.location.href = 'https://portal.sutthiporn.dev';
    return false;
};