import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private oauthService = inject(OAuthService);
    private router = inject(Router);

    userProfile = signal<Record<string, unknown> | null>(null);
    isAuthChecking = signal(true); // เพิ่ม Signal สำหรับ Loading State
    private initialized$ = toObservable(this.isAuthChecking);

    get isLoggedIn(): boolean {
        return this.oauthService.hasValidAccessToken();
    }

    hasValidAccessToken(): boolean {
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

    getAccessToken(): string {
        return this.oauthService.getAccessToken();
    }

    async ensureInitialized(): Promise<void> {
        if (!this.isAuthChecking()) return;
        await firstValueFrom(this.initialized$.pipe(filter(checking => !checking)));
    }

    private setupEventListeners() {
        this.oauthService.events.subscribe(event => {
            // console.debug('[AuthService] Event:', event.type);

            if (event.type === 'session_terminated') {
                console.warn('ตรวจพบการ Logout จากหน้าอื่น... กำลังออกจากระบบ');
                this.oauthService.logOut();
            }

            if (event.type === 'token_received' || event.type === 'token_refreshed') {
                this.loadUserProfile();
            }

            if (event.type === 'logout') {
                this.userProfile.set(null);
            }
        });
    }

    public async initService(): Promise<void> {
        this.oauthService.setStorage(localStorage);
        this.oauthService.configure(authConfig);
        this.oauthService.setupAutomaticSilentRefresh(); // สั่งเริ่มจับเวลา Refresh Token ไว้เลย
        console.log('[AuthService] Start initialize.');

        // Subscribe Event ก่อนเริ่มทำงาน
        this.setupEventListeners();

        try {
            // 1. โหลด Config และเช็คว่ามี Code เด้งกลับมาจากหน้า Login หรือไม่ (อันนี้ต้องรอ)
            await this.oauthService.loadDiscoveryDocumentAndTryLogin();
            console.log('[AuthService] Load Discovery Doc and try login done.');

            // 2. ตัดสินใจ
            if (this.oauthService.hasValidAccessToken()) {
                // Case A: มี Token แล้ว (Login อยู่แล้ว หรือเพิ่ง Login เสร็จ)
                console.log('[AuthService] Token found on load.');
                this.loadUserProfile();
                this.isAuthChecking.set(false); // ✅ ปลดล็อคหน้าจอทันที
            } else {
                // Case B: ไม่มี Token (เข้าเว็บครั้งแรก)
                console.log('[AuthService] No token found. Releasing UI...');

                // ✅ ปลดล็อคหน้าจอทันที! ให้ User เห็นปุ่ม Login ได้เลย ไม่ต้องรอ SSO
                this.isAuthChecking.set(false);

                // 3. แอบเช็ค SSO ข้างหลังบ้าน (Fire-and-Forget)
                this.checkSSOInBackground();
            }

        } catch (error) {
            console.error('[AuthService] Init Error:', error);
            this.isAuthChecking.set(false); // ปลดล็อคเสมอแม้ Error
        }
    }

    // แยกฟังก์ชันแอบเช็ค SSO ออกมา เพื่อไม่ให้ Code รก
    private checkSSOInBackground() {
        console.log('[AuthService] Starting Background SSO Check...');
        // ไม่ใส่ await เพื่อให้มันทำงานเป็น Background Process
        this.oauthService.silentRefresh()
            .then(() => {
                // ถ้าเช็คเจอว่า Login ค้างไว้
                if (this.oauthService.hasValidAccessToken()) {
                    console.log('[AuthService] Background SSO Success!');
                    this.loadUserProfile();
                    // Optional: อาจจะมีการ Redirect เข้า Dashboard อัตโนมัติถ้าต้องการ
                }
            })
            .catch(error => {
                // ถ้าไม่เจอ หรือ Error ก็ปล่อยผ่าน (เพราะเราปล่อย UI ไปแล้ว)
                console.debug('[AuthService] Background SSO Failed (Normal for guest):', error);
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
