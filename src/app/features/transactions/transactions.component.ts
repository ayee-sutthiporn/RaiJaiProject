import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
    selector: 'app-transactions-page',
    standalone: true,
    imports: [CommonModule, TransactionFormComponent, DatePipe, DecimalPipe],
    template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <header>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">ทำรายการ</h1>
         <p class="text-zinc-500 dark:text-zinc-400">จัดการรายรับรายจ่ายของคุณ</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         <!-- Form -->
         <div class="sticky top-24">
            <app-transaction-form></app-transaction-form>
         </div>

         <!-- Transaction History -->
         <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <h3 class="font-bold text-zinc-900 dark:text-white mb-4">ประวัติรายการ recent</h3>
            <div class="space-y-3">
                @for (tx of dataService.transactions(); track tx.id) {
                    <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-700/30 group">
                        <div class="flex items-center gap-3">
                            <div [class]="'w-10 h-10 rounded-full flex items-center justify-center text-lg ' + getCategoryColor(tx.type)">
                                {{ getEmoji(tx.category) }}
                            </div>
                            <div>
                                <p class="font-medium text-zinc-900 dark:text-white text-sm">{{ tx.category }}</p>
                                <p class="text-xs text-zinc-500">{{ tx.date | date:'d/MM/yy HH:mm' }} • {{ tx.description || '-' }}</p>
                            </div>
                        </div>
                        <div class="text-right flex items-center gap-3">
                            <p [class]="'font-bold text-sm ' + (tx.type === 'INCOME' ? 'text-emerald-600' : 'text-zinc-900 dark:text-zinc-200')">
                                {{ tx.type === 'EXPENSE' ? '-' : '+' }}{{ tx.amount | number }}
                            </p>
                            <button (click)="dataService.deleteTransaction(tx.id)" class="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    </div>
                } @empty {
                    <p class="text-center text-zinc-400 py-10">ยังไม่มีรายการ</p>
                }
            </div>
         </div>
      </div>
    </div>
  `
})
export class TransactionsPageComponent {
    dataService = inject(MockDataService);

    getCategoryColor(type: string): string {
        switch (type) {
            case 'INCOME': return 'bg-emerald-100 dark:bg-emerald-900/30';
            case 'EXPENSE': return 'bg-rose-100 dark:bg-rose-900/30';
            default: return 'bg-blue-100 dark:bg-blue-900/30';
        }
    }

    getEmoji(category: string): string {
        const map: Record<string, string> = {
            'อาหาร': '🍔', 'เดินทาง': '🚕', 'เงินเดือน': '💰', 'ช้อปปิ้ง': '🛍️',
            'บันเทิง': '🎬', 'โอนเงิน': '💸', 'เงินออม': '🏦', 'ซ่อมบำรุง': '🔧'
        };
        return map[category] || '📝';
    }
}
