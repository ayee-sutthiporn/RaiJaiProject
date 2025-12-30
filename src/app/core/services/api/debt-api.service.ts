import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Debt } from '../../models/debt.interface';

@Injectable({ providedIn: 'root' })
export class DebtApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getDebts(): Observable<Debt[]> {
        return this.http.get<Debt[]>(`${this.baseUrl}/debts`);
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
