import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap, Observable, of, delay } from 'rxjs';
import { User } from '../models/user.interface';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private router = inject(Router);

    // Private signals
    private _token = signal<string | null>(localStorage.getItem('token'));
    private _user = signal<User | null>(this.getUserFromStorage());

    // Public signals
    user = this._user.asReadonly();
    token = this._token.asReadonly();
    isLoggedIn = computed(() => !!this._token());
    isAuthChecking = signal(false);

    /**
     * Checks if the user has a valid access token.
     * Currently alias for isLoggedIn status.
     */
    hasValidAccessToken() {
        return this.isLoggedIn();
    }


    login(credentials: LoginRequest): Observable<AuthResponse> {
        // MOCK LOGIN
        const mockUser: User = {
            id: '1',
            username: credentials.username,
            name: 'Demo User',
            email: 'demo@raijai.com',
            firstName: 'Demo',
            lastName: 'User'
        };
        const mockResponse: AuthResponse = {
            token: 'mock-jwt-token-' + Math.random(),
            user: mockUser
        };

        return of(mockResponse).pipe(
            delay(800), // Simulate network delay
            tap(response => {
                this.setSession(response);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._token.set(null);
        this._user.set(null);
        this.router.navigate(['/login']);
    }

    getAccessToken(): string | null {
        return this._token();
    }

    private setSession(authResult: AuthResponse): void {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('user', JSON.stringify(authResult.user));
        this._token.set(authResult.token);
        this._user.set(authResult.user);
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }
}
