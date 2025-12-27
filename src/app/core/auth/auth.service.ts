import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private oauthService = inject(OAuthService);
    private router = inject(Router);

    userProfile = signal<Record<string, unknown> | null>(null);

    get isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    async login(targetUrl?: string): Promise<void> {
        this.oauthService.initLoginFlow(targetUrl || undefined);
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

        this.oauthService.setupAutomaticSilentRefresh();

        this.oauthService.events.subscribe(event => {
            console.log('[AuthService] OAuth Event:', event);
            if (event.type === 'token_received' || event.type === 'token_refreshed') {
                this.loadUserProfile();
            }
            if (event.type === 'token_received' && this.oauthService.state) {
                const targetUrl = decodeURIComponent(this.oauthService.state);
                // Basic validation to prevent open redirects if needed, but for internal router it's fine
                if (targetUrl.startsWith('/')) {
                    this.router.navigateByUrl(targetUrl);
                }
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
