import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-notification-dropdown',
    standalone: true,
    imports: [CommonModule, DatePipe],
    template: `
    <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div class="p-4 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center">
        <h3 class="font-bold text-zinc-900 dark:text-white">การแจ้งเตือน</h3>
        @if (service.unreadCount() > 0) {
            <button (click)="service.markAllAsRead()" class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">อ่านทั้งหมด</button>
        }
      </div>

      <div class="max-h-[60vh] overflow-y-auto">
        @for (notification of service.notifications(); track notification.id) {
            <div class="p-4 border-b border-zinc-50 dark:border-zinc-700/50 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors relative group" [class.bg-emerald-50_dark:bg-emerald-900_10]="!notification.read">
                <div class="flex gap-3">
                    <div class="mt-1 flex-shrink-0">
                         @switch (notification.type) {
                             @case ('success') {
                                 <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                 </div>
                             }
                             @case ('warning') {
                                 <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                 </div>
                             }
                             @default {
                                 <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                 </div>
                             }
                         }
                    </div>
                    <div class="flex-1">
                        <h4 class="text-sm font-bold text-zinc-900 dark:text-white" [class.text-zinc-500]="notification.read">{{ notification.title }}</h4>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{{ notification.message }}</p>
                        <p class="text-[10px] text-zinc-400 mt-2">{{ notification.timestamp | date:'shortTime' }}</p>
                    </div>
                    @if (!notification.read) {
                        <div class="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500"></div>
                    }
                </div>
            </div>
        } @empty {
            <div class="p-8 text-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 opacity-50"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <p class="text-sm">ไม่มีการแจ้งเตือน</p>
            </div>
        }
      </div>
    </div>
  `
})
export class NotificationDropdownComponent {
    service = inject(NotificationService);
}
