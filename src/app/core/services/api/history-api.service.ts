import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HistoryLog } from '../../models/history-log.interface';

@Injectable({ providedIn: 'root' })
export class HistoryApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    getHistory(entityId?: string, entityType?: string): Observable<HistoryLog[]> {
        let params = new HttpParams();
        if (entityId) {
            params = params.set('entity_id', entityId);
        }
        if (entityType) {
            params = params.set('entity_type', entityType);
        }
        return this.http.get<HistoryLog[]>(`${this.baseUrl}/history`, { params });
    }
}
