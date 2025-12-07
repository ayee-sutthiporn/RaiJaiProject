import { Injectable, inject, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private keycloak = inject(KeycloakService);

    userProfile = signal<KeycloakProfile | null>(null);

    constructor() {
        this.loadUserProfile();
    }

    get isLoggedIn(): boolean {
        return this.keycloak.isLoggedIn();
    }

    async login(redirectUri?: string): Promise<void> {
        await this.keycloak.login({
            redirectUri: redirectUri || window.location.origin
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
}
