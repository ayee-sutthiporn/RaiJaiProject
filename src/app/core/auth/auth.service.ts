import { Injectable, inject, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private oauthService = inject(OAuthService);

    userProfile = signal<Record<string, unknown> | null>(null);

    get isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    async login(): Promise<void> {
        this.oauthService.initLoginFlow();
    }

    logout(): void {
        this.oauthService.logOut();
    }

    getToken(): string {
        return this.oauthService.getAccessToken();
    }

    private async initService(): Promise<void> {
        this.oauthService.configure(authConfig);
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();

        if (this.oauthService.hasValidAccessToken()) {
            this.loadUserProfile();
        }

        this.oauthService.events.subscribe(event => {
            console.log('[AuthService] OAuth Event:', event);
            if (event.type === 'token_received' || event.type === 'token_refreshed') {
                this.loadUserProfile();
            }
            if (event.type === 'logout') {
                this.userProfile.set(null);
            }
        });
    }

    private loadUserProfile(): void {
        const claims = this.oauthService.getIdentityClaims();
        if (claims) {
            this.userProfile.set(claims as Record<string, unknown>);
            console.log('[AuthService] User Profile Loaded:', claims);
        }
    }

    constructor() {
        console.log('[AuthService] Initializing...');
        this.initService().then(() => {
            console.log('[AuthService] Initialization complete');
            console.log('[AuthService] Is Logged In:', this.isLoggedIn);
        }).catch(err => {
            console.error('[AuthService] Initialization failed:', err);
        });
    }
}
