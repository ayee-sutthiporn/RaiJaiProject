import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Debt } from '../../models/debt.interface';

@Injectable({ providedIn: 'root' })
export class DebtApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getDebts(type?: 'LENT' | 'BORROWED', bookId?: string): Observable<Debt[]> {
        let params = new HttpParams();
        if (type) params = params.set('type', type);
        if (bookId) params = params.set('book_id', bookId);
        return this.http.get<Debt[]>(`${this.baseUrl}/debts`, { params });
    }

    createDebt(debt: Partial<Debt>): Observable<Debt> {
        return this.http.post<Debt>(`${this.baseUrl}/debts`, debt);
    }

    updateDebt(id: string, debt: Partial<Debt>): Observable<Debt> {
        return this.http.put<Debt>(`${this.baseUrl}/debts/${id}`, debt);
    }

    deleteDebt(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/debts/${id}`);
    }

    payDebt(id: string, amount: number): Observable<Debt> {
        return this.http.post<Debt>(`${this.baseUrl}/debts/${id}/payment`, { amount });
    }
}
