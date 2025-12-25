import { Injectable, inject, signal } from '@angular/core';
import { KeycloakService, KeycloakEventType } from 'keycloak-angular';
import { KeycloakProfile, KeycloakLoginOptions } from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private keycloak = inject(KeycloakService);

    userProfile = signal<KeycloakProfile | null>(null);

    get isLoggedIn(): boolean {
        return this.keycloak.isLoggedIn();
    }

    async login(options?: KeycloakLoginOptions): Promise<void> {
        await this.keycloak.login({
            redirectUri: window.location.origin,
            ...options
        });
    }

    async logout(redirectUri?: string): Promise<void> {
        await this.keycloak.logout(redirectUri || window.location.origin);
    }

    async loadUserProfile(): Promise<void> {
        if (this.isLoggedIn) {
            const profile = await this.keycloak.loadUserProfile();
            this.userProfile.set(profile);
        }
    }

    getToken(): Promise<string> {
        return this.keycloak.getToken();
    }

    private initService(): void {
        this.keycloak.keycloakEvents$.subscribe({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            next: (event: any) => {
                if (event.type === KeycloakEventType.OnAuthLogout) {
                    this.userProfile.set(null);
                    window.location.href = 'https://portal.sutthiporn.dev';
                }
            }
        });
    }

    constructor() {
        this.loadUserProfile();
        this.initService();
    }
}
