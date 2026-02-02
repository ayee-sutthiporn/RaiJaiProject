import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../models/category.interface';

@Injectable({ providedIn: 'root' })
export class CategoryApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getCategories(type?: 'INCOME' | 'EXPENSE', bookId?: string): Observable<Category[]> {
        let params = new HttpParams();
        if (type) params = params.set('type', type);
        if (bookId) params = params.set('book_id', bookId);
        return this.http.get<Category[]>(`${this.baseUrl}/categories`, { params });
    }

    createCategory(category: Partial<Category>): Observable<Category> {
        return this.http.post<Category>(`${this.baseUrl}/categories`, category);
    }

    updateCategory(id: string, category: Partial<Category>): Observable<Category> {
        return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category);
    }

    deleteCategory(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/categories/${id}`);
    }
}
