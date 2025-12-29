import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoryLog } from '../../../core/models/history-log.interface';

@Component({
    selector: 'app-history-list',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <div class="space-y-4">
      @for (log of history(); track log.id) {
        <div class="flex gap-3 text-sm">
          <div [class]="'mt-1 w-2 h-2 rounded-full flex-shrink-0 ' + getStatusColor(log.action)"></div>
          <div class="flex-1">
            <p class="font-medium text-zinc-900 dark:text-white">{{ log.details }}</p>
            <p class="text-xs text-zinc-500">{{ log.timestamp | date:'d MMM yyyy, HH:mm' }}</p>
          </div>
        </div>
      } @empty {
        <div class="text-center py-4 text-zinc-400 text-sm">ไม่มีประวัติการแก้ไข</div>
      }
    </div>
  `
})
export class HistoryListComponent {
    history = input.required<HistoryLog[]>();

    getStatusColor(action: string): string {
        switch (action) {
            case 'CREATE': return 'bg-emerald-500';
            case 'UPDATE': return 'bg-blue-500';
            case 'DELETE': return 'bg-red-500';
            case 'PAYMENT': return 'bg-indigo-500';
            default: return 'bg-zinc-300';
        }
    }
}
