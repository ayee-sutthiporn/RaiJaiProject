export interface HistoryLog {
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PAYMENT';
    timestamp: string; // ISO date
    details: string; // Human readable description
    previousValue?: unknown; // Snapshot of changed fields if needed
    newValue?: unknown;
    changes?: string[];
}
