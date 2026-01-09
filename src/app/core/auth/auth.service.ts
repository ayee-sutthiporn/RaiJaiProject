import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from '../../../environments/environment';

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
    private http = inject(HttpClient);
    private router = inject(Router);

    // Private signals
    private _token = signal<string | null>(localStorage.getItem('token'));
    private _user = signal<User | null>(this.getUserFromStorage());

    // Public signals
    user = this._user.asReadonly();
    token = this._token.asReadonly();
    isLoggedIn = computed(() => !!this._token());

    // API URL
    private apiUrl = `${environment.apiBaseUrl}/auth`;

    constructor() {
        // Optional: Validate token on startup or decode JWT to check expiry
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
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

    // Optional: Add a method to load user profile if not returned by login
    // loadProfile() { ... }
}
