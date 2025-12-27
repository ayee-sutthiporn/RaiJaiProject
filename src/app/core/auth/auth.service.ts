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

    public async initService(): Promise<void> {
        this.oauthService.configure(authConfig);
        console.log('[AuthService] Start initialize.');

        // 1. โหลด Discovery Doc และเช็คว่าเป็นการ Redirect กลับมาจากหน้า Login หรือไม่
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        console.log('[AuthService] Load Discovery Doc and try login.');

        // 2. เช็คผลลัพธ์
        if (this.oauthService.hasValidAccessToken()) {
            // A. กรณี Login สำเร็จ (มี Token อยู่แล้ว หรือเพิ่ง Redirect กลับมา)
            console.log('[AuthService] Token found on load.');
            this.loadUserProfile();
        } else {
            // B. กรณีไม่มี Token -> ลองทำ SSO (Silent Refresh) เช็คว่า Login ค้างไว้ที่ Portal หรือไม่
            console.log('[AuthService] No token found. Attempting Silent Refresh (SSO)...');
            try {
                await this.oauthService.silentRefresh();
                if (this.oauthService.hasValidAccessToken()) {
                    console.log('[AuthService] SSO Success! Logged in silently.');
                    this.loadUserProfile();
                }
            } catch (error) {
                console.warn('[AuthService] SSO Failed or User not logged in at Identity Provider.', error);
                // ไม่ต้องทำอะไร ปล่อยให้สถานะเป็น Logged Out
            }
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
        // this.initService().then(() => {
        //     console.log('[AuthService] Initialization complete');
        //     console.log('[AuthService] Is Logged In:', this.isLoggedIn);
        // }).catch(err => {
        //     console.error('[AuthService] Initialization failed:', err);
        // });
    }
}
