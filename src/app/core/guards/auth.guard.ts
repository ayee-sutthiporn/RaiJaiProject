import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
    const authService = inject(AuthService);

    if (authService.isLoggedIn) {
        return true;
    }

    // Check if we already tried to login (have a code) but still aren't logged in
    if (window.location.search.includes('code=')) {
        console.error('Login failed: Code present but not authenticated. Stopping loop.');
        // Optional: Redirect to an error page or clear parameters
        return false;
    }

    await authService.login(state.url);

    return false;
};