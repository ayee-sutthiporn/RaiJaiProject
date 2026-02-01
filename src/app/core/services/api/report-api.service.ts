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

    private getParams(params?: { startDate?: string; endDate?: string; groupBy?: string }) {
        let httpParams = {};
        if (params?.startDate) httpParams = { ...httpParams, start_date: params.startDate };
        if (params?.endDate) httpParams = { ...httpParams, end_date: params.endDate };
        if (params?.groupBy) httpParams = { ...httpParams, group_by: params.groupBy };
        return httpParams;
    }

    getSummary(params?: { startDate?: string; endDate?: string }): Observable<ReportSummary> {
        return this.http.get<ReportSummary>(`${this.baseUrl}/reports/summary`, { params: this.getParams(params) });
    }

    getCategoryPie(params?: { startDate?: string; endDate?: string }): Observable<CategoryPieData[]> {
        return this.http.get<CategoryPieData[]>(`${this.baseUrl}/reports/category-pie`, { params: this.getParams(params) });
    }

    getBalanceHistory(): Observable<BalanceHistory[]> {
        return this.http.get<BalanceHistory[]>(`${this.baseUrl}/reports/balance-history`);
    }

    getDailyCashFlow(params?: { startDate?: string; endDate?: string; groupBy?: 'day' | 'month' | 'year' }): Observable<DailyCashFlow[]> {
        return this.http.get<DailyCashFlow[]>(`${this.baseUrl}/reports/daily-cashflow`, { params: this.getParams(params) });
    }
}
