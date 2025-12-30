import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.interface';

@Injectable({ providedIn: 'root' })
export class UserApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/auth/me`);
    }
}
