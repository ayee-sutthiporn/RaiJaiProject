import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);

    if (authService.isLoggedIn) {
        return true;
    }

    await authService.login(window.location.origin + state.url);
    return false;
};
