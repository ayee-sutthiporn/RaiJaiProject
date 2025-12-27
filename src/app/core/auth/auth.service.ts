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

    // auth.service.ts

    public async initService(): Promise<void> {
        this.oauthService.setStorage(localStorage);
        this.oauthService.configure(authConfig);
        console.log('[AuthService] Start initialize.');

        // 1. ลองโหลดและเช็ค Login
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        console.log('[AuthService] Load Discovery Doc and try login.');

        // 2. เช็คผลลัพธ์
        if (this.oauthService.hasValidAccessToken()) {
            console.log('[AuthService] Token found on load.');
            this.loadUserProfile();
        } else {
            // ลองทำ SSO (ถ้า Browser ไม่บล็อก Cookie)
            console.log('[AuthService] No token found. Attempting Silent Refresh (SSO)...');
            try {
                // หมายเหตุ: ถ้าใน Config ตั้ง useSilentRefresh: false ไว้
                // บรรทัดนี้อาจจะ Error หรือ Timeout ได้ในบาง Browser (แต่มี try catch ดักไว้แล้ว ถือว่าโอเคครับ)
                await this.oauthService.silentRefresh();
                if (this.oauthService.hasValidAccessToken()) {
                    console.log('[AuthService] SSO Success! Logged in silently.');
                    this.loadUserProfile();
                }
            } catch (error) {
                console.warn('[AuthService] SSO Failed (User might not be logged in or Cookie blocked).', error);
            }
        }

        // --- จุดที่ปรับแก้ที่ 1: สั่งเริ่มระบบ Auto Refresh Token แค่ครั้งเดียวก็พอ ---
        this.oauthService.setupAutomaticSilentRefresh();

        // 3. ดักจับ Event ต่างๆ
        this.oauthService.events.subscribe(event => {
            console.log('[AuthService] OAuth Event:', event);

            // --- Logic สำหรับ SLO (Single Log-Out) ---
            // ถ้า Keycloak บอกว่า Session จบแล้ว -> ให้ App เรา Logout ตาม
            if (event.type === 'session_terminated') {
                console.warn('ตรวจพบการ Logout จากหน้าอื่น... กำลังออกจากระบบ');
                this.oauthService.logOut();
            }

            if (event.type === 'token_received' || event.type === 'token_refreshed') {
                this.loadUserProfile();
            }

            // ... Logic อื่นๆ ...
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
