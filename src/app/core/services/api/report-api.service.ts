import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReportSummary {
    income: number;
    expense: number;
    balance: number;
}

export interface CategoryPieData {
    category: string;
    amount: number;
    color: string;
}

export interface BalanceHistory {
    date: string;
    balance: number;
}

export interface DailyCashFlow {
    date: string;
    income: number;
    expense: number;
}

@Injectable({ providedIn: 'root' })
export class ReportApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getSummary(): Observable<ReportSummary> {
        return this.http.get<ReportSummary>(`${this.baseUrl}/reports/summary`);
    }

    getCategoryPie(): Observable<CategoryPieData[]> {
        return this.http.get<CategoryPieData[]>(`${this.baseUrl}/reports/category-pie`);
    }

    getBalanceHistory(): Observable<BalanceHistory[]> {
        return this.http.get<BalanceHistory[]>(`${this.baseUrl}/reports/balance-history`);
    }

    getDailyCashFlow(): Observable<DailyCashFlow[]> {
        return this.http.get<DailyCashFlow[]>(`${this.baseUrl}/reports/daily-cashflow`);
    }
}
