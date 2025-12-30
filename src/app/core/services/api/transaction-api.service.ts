import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Transaction } from '../../models/transaction.interface';

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getTransactions(walletId?: string): Observable<Transaction[]> {
        let params = new HttpParams();
        if (walletId) {
            params = params.set('wallet_id', walletId);
        }
        return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`, { params });
    }

    createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.baseUrl}/transactions`, transaction);
    }

    updateTransaction(id: string, transaction: Partial<Transaction>): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.baseUrl}/transactions/${id}`, transaction);
    }

    deleteTransaction(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/transactions/${id}`);
    }
}
