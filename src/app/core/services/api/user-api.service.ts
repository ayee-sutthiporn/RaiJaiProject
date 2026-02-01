import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.interface';

@Injectable({ providedIn: 'root' })
export class UserApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    // Admin / General User Management
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/users`);
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/users/${id}`);
    }

    addUser(user: Partial<User>): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/users`, user);
    }

    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
    }

    deleteUser(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`);
    }

    // Current User Profile
    getMe(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/users/me`);
    }

    updateMe(user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/users/me`, user);
    }

    changePassword(oldPassword: string, newPassword: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/users/me/change-password`, { oldPassword, newPassword });
    }
}
