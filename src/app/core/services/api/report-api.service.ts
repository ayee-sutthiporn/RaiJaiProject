import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReportSummary {
    income: number;
    expense: number;
    balance: number;
}

@Injectable({ providedIn: 'root' })
export class ReportApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getSummary(): Observable<ReportSummary> {
        return this.http.get<ReportSummary>(`${this.baseUrl}/reports/summary`);
    }

    getCategoryPie(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/reports/category-pie`);
    }

    getBalanceHistory(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/reports/balance-history`);
    }
}
