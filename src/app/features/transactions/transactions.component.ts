import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionApiService } from '../../core/services/api/transaction-api.service';
import { CategoryApiService } from '../../core/services/api/category-api.service';
import { ImageModalComponent } from '../../shared/components/image-modal/image-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from '../../core/services/toast.service';
import { Transaction } from '../../core/models/transaction.interface';
import { Category } from '../../core/models/category.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-transactions-page',
    standalone: true,
    imports: [CommonModule, TransactionFormComponent, DatePipe, DecimalPipe, ImageModalComponent, ConfirmModalComponent],
    providers: [DatePipe],
    template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-20">
      <header>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">ทำรายการ</h1>
         <p class="text-zinc-500 dark:text-zinc-400">จัดการรายรับรายจ่ายของคุณ</p>
      </header>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-between overflow-hidden">
               <div>
                   <p class="text-emerald-100 text-sm font-medium mb-1">รายรับ</p>
                   <h3 class="text-2xl font-bold">+{{ summaryStats().income | number:'1.2-2' }}</h3>
               </div>
               <div class="flex items-center justify-center p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <span class="material-icons-outlined text-4xl text-white">trending_up</span>
               </div>
          </div>
          <div class="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-5 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none flex items-center justify-between overflow-hidden">
               <div>
                   <p class="text-rose-100 text-sm font-medium mb-1">รายจ่าย</p>
                   <h3 class="text-2xl font-bold">-{{ summaryStats().expense | number:'1.2-2' }}</h3>
               </div>
               <div class="flex items-center justify-center p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <span class="material-icons-outlined text-4xl text-white">trending_down</span>
               </div>
          </div>
          <div class="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-5 rounded-2xl shadow-lg shadow-zinc-200 dark:shadow-none flex items-center justify-between overflow-hidden">
               <div>
                   <p class="text-zinc-400 text-sm font-medium mb-1">คงเหลือสุทธิ</p>
                   <h3 class="text-2xl font-bold">{{ summaryStats().balance | number:'1.2-2' }}</h3>
               </div>
               <div class="flex items-center justify-center p-3 bg-white/10 rounded-full backdrop-blur-sm">
                    <span class="material-icons-outlined text-4xl text-white">account_balance_wallet</span>
               </div>
          </div>
      </div>
      
      <!-- Actions & Filters -->
      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <!-- Type Tabs -->
          <div class="flex p-1 bg-zinc-100 dark:bg-zinc-700/50 rounded-xl">
               <button (click)="setFilterType('ALL')" [class]="'px-6 py-2 rounded-lg text-sm font-medium transition-all ' + (filterType() === 'ALL' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200')">
                   ทั้งหมด
               </button>
               <button (click)="setFilterType('INCOME')" [class]="'px-6 py-2 rounded-lg text-sm font-medium transition-all ' + (filterType() === 'INCOME' ? 'bg-white dark:bg-zinc-600 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200')">
                   รายรับ
               </button>
               <button (click)="setFilterType('EXPENSE')" [class]="'px-6 py-2 rounded-lg text-sm font-medium transition-all ' + (filterType() === 'EXPENSE' ? 'bg-white dark:bg-zinc-600 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200')">
                   รายจ่าย
               </button>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                <!-- Date Filter -->
                <div class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-700/30 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2 z-10">
                    <span class="material-icons-outlined text-zinc-400 text-sm ml-1">date_range</span>
                    <div class="relative">
                        <input type="date" [value]="startDate() || ''" (change)="setStartDate($event)" class="bg-transparent border-none text-sm text-zinc-600 dark:text-zinc-300 outline-none w-32 cursor-pointer relative z-20">
                    </div>
                    <span class="text-zinc-300">-</span>
                     <div class="relative">
                        <input type="date" [value]="endDate() || ''" (change)="setEndDate($event)" class="bg-transparent border-none text-sm text-zinc-600 dark:text-zinc-300 outline-none w-32 cursor-pointer relative z-20">
                     </div>
                </div>

                <!-- Category Filter -->
                <div class="relative group">
                    <select [value]="filterCategoryId() || ''" (change)="setFilterCategory($event)" class="appearance-none pl-4 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-700/30 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-500/20 text-zinc-600 dark:text-zinc-200 cursor-pointer min-w-[160px]">
                        <option value="">ทุกหมวดหมู่</option>
                        @for (cat of categories(); track cat.id) {
                            <option [value]="cat.id">{{ cat.name }}</option>
                        }
                    </select>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none material-icons-outlined text-[18px]">expand_more</span>
                </div>

                <!-- Add Button -->
                <button (click)="openModal()" class="w-full sm:w-auto ml-auto bg-zinc-900 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-zinc-200 dark:shadow-none hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2">
                    <span class="material-icons-outlined text-[18px]">add</span>
                    รายการใหม่
                </button>
          </div>
      </div>
      
      <!-- Transactions List -->
      <div class="space-y-6">
         @if(isLoading()) {
            <div class="text-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                <p class="mt-4 text-zinc-500">กำลังโหลดข้อมูล...</p>
            </div>
         } @else {
             @for (group of groupedTransactions(); track group.date) {
                 <div class="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                     <!-- Date Header -->
                     <div class="flex items-end justify-between px-2">
                         <h3 class="font-bold text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-2">
                             <span class="bg-zinc-200 dark:bg-zinc-700 w-2 h-2 rounded-full inline-block"></span>
                             {{ group.date | date:'EEEE, dd MMMM yyyy' }}
                         </h3>
                         <span [class]="'text-xs font-bold px-2 py-1 rounded-md ' + (group.dailyTotal >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400')">
                             {{ group.dailyTotal >= 0 ? '+' : '' }}{{ group.dailyTotal | number:'1.2-2' }}
                         </span>
                     </div>
    
                     <!-- List Items -->
                     <div class="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-700/50">
                         @for (tx of group.transactions; track tx.id) {
                            <div class="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors group cursor-pointer relative overflow-hidden">
                                <!-- Hover Effect Bar -->
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900 dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
    
                                <div class="flex items-center gap-4">
                                    <div [class]="'w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ' + getCategoryColor(tx.type)">
                                        <span class="material-icons-outlined">{{ tx.category?.icon || 'article' }}</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                                            {{ tx.category?.name || 'ไม่มีหมวดหมู่' }}
                                            @if (tx.imageUrl) {
                                                <button (click)="viewImage($event, tx.imageUrl, tx.description || 'รูปภาพ')" class="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all" title="ดูรูปภาพ">
                                                    <span class="material-icons-outlined text-[14px]">image</span>
                                                </button>
                                            }
                                        </p>
                                        <p class="text-xs text-zinc-500 font-medium mt-0.5">{{ tx.wallet?.name }} • {{ tx.description || '-' }}</p>
                                    </div>
                                </div>
                                <div class="text-right flex items-center gap-4">
                                    <div>
                                         <p [class]="'font-bold text-base ' + (tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white')">
                                            {{ tx.type === 'EXPENSE' ? '-' : '+' }}{{ tx.amount | number }}
                                        </p>
                                        <p class="text-[10px] text-zinc-400">{{ tx.date | date:'HH:mm' }}</p>
                                    </div>
                                    <button (click)="onDeleteTransaction(tx.id)" class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <span class="material-icons-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                         }
                     </div>
                 </div>
             } @empty {
                 <div class="text-center py-20 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 border-dashed">
                     <div class="w-20 h-20 bg-zinc-50 dark:bg-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300 dark:text-zinc-600">
                         <span class="material-icons-outlined text-4xl">receipt_long</span>
                     </div>
                     <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-1">ยังไม่มีรายการ</h3>
                     <p class="text-zinc-500 text-sm">เริ่มจดบันทึกรายรับรายจ่ายของคุณได้เลย</p>
                 </div>
             }
         }
      </div>

       <!-- Modal -->
       @if (showModal()) {
           <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 ease-out">
               <div class="relative w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                   <button (click)="closeModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                   </button>
                   <app-transaction-form (formSubmitted)="onFormSubmitted()"></app-transaction-form>
               </div>
           </div>
       }

       <!-- Image Modal -->
       @if (selectedImage()) {
            <app-image-modal 
                [imageUrl]="selectedImage()!" 
                [title]="selectedImageTitle()" 
                (closeModal)="closeImage()">
            </app-image-modal>
        }

        <!-- Confirm Modal -->
        @if (confirmModalOpen()) {
            <app-confirm-modal
                [title]="'ยืนยันการลบรายการ'"
                [message]="'คุณต้องการลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้'"
                (confirmed)="confirmDelete()"
                (cancelled)="confirmModalOpen.set(false)">
            </app-confirm-modal>
        }
    </div>
  `
})
export class TransactionsPageComponent {
    private transactionService = inject(TransactionApiService);
    private categoryService = inject(CategoryApiService);
    datePipe = inject(DatePipe);
    toastService = inject(ToastService);

    // Signals for data
    transactions = signal<Transaction[]>([]);
    categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });
    isLoading = signal(false);

    showModal = signal(false);
    filterType = signal<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    filterCategoryId = signal<string | null>(null);
    startDate = signal<string | null>(null);
    endDate = signal<string | null>(null);

    selectedImage = signal<string | null>(null);
    selectedImageTitle = signal<string>('');

    // Confirm Modal Logic
    confirmModalOpen = signal(false);
    deleteId = signal<string | null>(null);

    constructor() {
        this.loadTransactions();
    }

    loadTransactions() {
        this.isLoading.set(true);
        this.transactionService.getTransactions().subscribe({
            next: (data) => {
                this.transactions.set(data || []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load transactions', err);
                this.isLoading.set(false);
                this.toastService.show({ type: 'error', title: 'ข้อผิดพลาด', message: 'ไม่สามารถโหลดข้อมูลได้' });
            }
        });
    }

    viewImage(event: Event, url: string, title: string) {
        event.stopPropagation();
        this.selectedImage.set(url);
        this.selectedImageTitle.set(title);
    }

    closeImage() {
        this.selectedImage.set(null);
    }

    filteredTransactions = computed(() => {
        let txs = this.transactions();

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

    summaryStats = computed(() => {
        const txs = this.filteredTransactions();
        const income = txs.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const expense = txs.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        return {
            income,
            expense,
            balance: income - expense
        };
    });

    groupedTransactions = computed(() => {
        const txs = this.filteredTransactions();
        const groups: { date: string, transactions: typeof txs, dailyTotal: number }[] = [];

        txs.forEach(tx => {
            const dateStr = tx.date.split('T')[0]; // YYYY-MM-DD
            let group = groups.find(g => g.date === dateStr);
            if (!group) {
                group = { date: dateStr, transactions: [], dailyTotal: 0 };
                groups.push(group);
            }
            group.transactions.push(tx);
            if (tx.type === 'INCOME') group.dailyTotal += tx.amount;
            else group.dailyTotal -= tx.amount;
        });

        return groups;
    });

    openModal() { this.showModal.set(true); }
    closeModal() { this.showModal.set(false); }

    onFormSubmitted() {
        this.closeModal();
        this.loadTransactions(); // Reload data
        this.toastService.show({ type: 'success', title: 'สำเร็จ', message: 'บันทึกรายการเรียบร้อย' });
    }

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
            case 'INCOME': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'EXPENSE': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
            default: return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        }
    }

    onDeleteTransaction(id: string) {
        this.deleteId.set(id);
        this.confirmModalOpen.set(true);
    }

    async confirmDelete() {
        if (this.deleteId()) {
            this.transactionService.deleteTransaction(this.deleteId()!).subscribe({
                next: () => {
                    this.toastService.show({
                        type: 'success',
                        title: 'สำเร็จ',
                        message: 'ลบรายการเรียบร้อยแล้ว'
                    });
                    this.confirmModalOpen.set(false);
                    this.deleteId.set(null);
                    this.loadTransactions();
                },
                error: (error) => {
                    console.error('Failed to delete transaction', error);
                    this.toastService.show({
                        type: 'error',
                        title: 'ผิดพลาด',
                        message: 'เกิดข้อผิดพลาดในการลบรายการ'
                    });
                }
            });
        }
    }
}
