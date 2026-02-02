import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Wallet } from '../../models/wallet.interface';

@Injectable({ providedIn: 'root' })
export class WalletApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getWallets(userId?: string, bookId?: string): Observable<Wallet[]> {
        let params = new HttpParams();
        if (userId) params = params.set('user_id', userId);
        if (bookId) params = params.set('book_id', bookId);
        return this.http.get<Wallet[]>(`${this.baseUrl}/wallets`, { params });
    }

    createWallet(wallet: Partial<Wallet>): Observable<Wallet> {
        return this.http.post<Wallet>(`${this.baseUrl}/wallets`, wallet);
    }

    updateWallet(id: string, wallet: Partial<Wallet>): Observable<Wallet> {
        return this.http.put<Wallet>(`${this.baseUrl}/wallets/${id}`, wallet);
    }

    deleteWallet(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/wallets/${id}`);
    }
}
