import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Book {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookMember {
    id: string; // User ID
    username: string;
    email: string;
    name: string;
    avatarUrl: string;
    role: string; // OWNER, EDITOR, VIEWER
}

@Injectable({ providedIn: 'root' })
export class BookApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getBooks(): Observable<Book[]> {
        return this.http.get<Book[]>(`${this.baseUrl}/books`);
    }

    createBook(data: { name: string; description?: string }): Observable<Book> {
        return this.http.post<Book>(`${this.baseUrl}/books`, data);
    }

    getMembers(bookId: string): Observable<BookMember[]> {
        return this.http.get<BookMember[]>(`${this.baseUrl}/books/${bookId}/members`);
    }

    addMember(bookId: string, email: string, role = 'EDITOR'): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/books/${bookId}/members`, { email, role });
    }
}
