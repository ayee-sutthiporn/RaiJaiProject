import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { DataService } from '../../core/services/data.service';

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
      
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <!-- Filters -->
          <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               <button (click)="setFilterType('ALL')" [class]="'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ' + (filterType() === 'ALL' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-transparent' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600')">
                   ทั้งหมด
               </button>
               <button (click)="setFilterType('INCOME')" [class]="'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ' + (filterType() === 'INCOME' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600')">
                   รายรับ
               </button>
               <button (click)="setFilterType('EXPENSE')" [class]="'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ' + (filterType() === 'EXPENSE' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600')">
                   รายจ่าย
               </button>
          </div>

          <!-- Add Button -->
          <button (click)="openModal()" class="w-full md:w-auto bg-zinc-900 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-zinc-200 dark:shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              ทำรายการใหม่
          </button>
      </div>
      
      <div class="grid grid-cols-1 gap-8 items-start">
         <!-- Removed Inline Form -->

          <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
             <div class="flex justify-between items-center mb-4 gap-2 flex-wrap">
                 <h3 class="font-bold text-zinc-900 dark:text-white whitespace-nowrap">ประวัติรายการ</h3>
                 <!-- Filters Group -->
                 <div class="flex items-center gap-2">
                     <!-- Date Filter -->
                     <!-- Date Range Filter -->
                     <div class="flex items-center gap-1">
                        <input type="date" [value]="startDate() || ''" (change)="setStartDate($event)" class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white w-32" placeholder="Start">
                        <span class="text-zinc-400">-</span>
                        <input type="date" [value]="endDate() || ''" (change)="setEndDate($event)" class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white w-32" placeholder="End">
                     </div>
                     
                     <!-- Category Filter Dropdown -->
                     <select [value]="filterCategoryId() || ''" (change)="setFilterCategory($event)" class="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white max-w-[140px]">
                         <option value="">ทุกหมวดหมู่</option>
                         @for (cat of dataService.categories(); track cat.id) {
                             <option [value]="cat.id">{{ cat.name }}</option>
                         }
                     </select>
                 </div>
             </div>
             
             <div class="space-y-3">
                 @for (tx of filteredTransactions(); track tx.id) {
                    <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-700/30 group">
                        <div class="flex items-center gap-3">
                            <div [class]="'w-10 h-10 rounded-full flex items-center justify-center text-lg ' + getCategoryColor(tx.type)">
                                {{ tx.category?.icon || '📝' }}
                            </div>
                            <div>
                                <p class="font-medium text-zinc-900 dark:text-white text-sm">{{ tx.category?.name || 'ไม่มีหมวดหมู่' }}</p>
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

       <!-- Modal -->
       @if (showModal()) {
           <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div class="relative w-full max-w-md">
                   <button (click)="closeModal()" class="absolute top-4 right-4 z-10 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                   </button>
                   <app-transaction-form (formSubmitted)="closeModal()"></app-transaction-form>
               </div>
           </div>
       }
    </div>
  `
})
export class TransactionsPageComponent {
    dataService = inject(DataService);

    showModal = signal(false);
    filterType = signal<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    filterCategoryId = signal<string | null>(null);
    startDate = signal<string | null>(null);
    endDate = signal<string | null>(null);

    filteredTransactions = computed(() => {
        let txs = this.dataService.transactions();

        // Filter Type
        if (this.filterType() !== 'ALL') {
            txs = txs.filter(t => t.type === this.filterType());
        }

        // Filter Category
        if (this.filterCategoryId()) {
            txs = txs.filter(t => t.categoryId === this.filterCategoryId());
        }

        // Filter Date Range
        if (this.startDate()) {
            const start = new Date(this.startDate()!);
            start.setHours(0, 0, 0, 0); // Start of day
            txs = txs.filter(t => new Date(t.date) >= start);
        }

        if (this.endDate()) {
            const end = new Date(this.endDate()!);
            end.setHours(23, 59, 59, 999); // End of day
            txs = txs.filter(t => new Date(t.date) <= end);
        }

        // Sort by date desc
        return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    openModal() { this.showModal.set(true); }
    closeModal() { this.showModal.set(false); }

    setFilterType(type: 'ALL' | 'INCOME' | 'EXPENSE') {
        this.filterType.set(type);
    }

    setFilterCategory(event: Event) {
        const val = (event.target as HTMLSelectElement).value;
        this.filterCategoryId.set(val === '' ? null : val);
    }

    setStartDate(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.startDate.set(val === '' ? null : val);
    }

    setEndDate(event: Event) {
        const val = (event.target as HTMLInputElement).value;
        this.endDate.set(val === '' ? null : val);
    }

    getCategoryColor(type: string): string {
        switch (type) {
            case 'INCOME': return 'bg-emerald-100 dark:bg-emerald-900/30';
            case 'EXPENSE': return 'bg-rose-100 dark:bg-rose-900/30';
            default: return 'bg-blue-100 dark:bg-blue-900/30';
        }
    }
}
