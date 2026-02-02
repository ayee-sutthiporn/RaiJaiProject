import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { ExpenseDonutChartComponent } from './components/expense-donut-chart/expense-donut-chart.component';
import { CashFlowChartComponent } from './components/cash-flow-chart/cash-flow-chart.component';
import { ReportApiService, ReportSummary, CategoryPieData, DailyCashFlow } from '../../core/services/api/report-api.service';
import { TransactionApiService } from '../../core/services/api/transaction-api.service';
import { DebtApiService } from '../../core/services/api/debt-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { DataService } from '../../core/services/data.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { Transaction } from '../../core/models/transaction.interface';
import { Debt } from '../../core/models/debt.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, RecentTransactionsComponent, ExpenseDonutChartComponent, CashFlowChartComponent],
  template: `
    <div class="space-y-8 animate-in fade-in duration-500 pb-20">
      
      <!-- Header -->
      <header class="flex items-center justify-between">
        <div>
           <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-300">
             ภาพรวมกระเป๋าเงิน
           </h1>
           <p class="text-zinc-500 dark:text-zinc-400 mt-1">ยินดีต้อนรับกลับ, {{ user()?.name || 'User' }} 👋</p>
        </div>
        
        <!-- Filter Toggle -->
        <div class="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
             <button (click)="setFilter('daily')" 
                [class]="'px-4 py-2 text-sm font-medium rounded-lg transition-all ' + (filterType() === 'daily' ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400')">
                รายวัน
             </button>
             <button (click)="setFilter('monthly')"
                [class]="'px-4 py-2 text-sm font-medium rounded-lg transition-all ' + (filterType() === 'monthly' ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400')">
                รายเดือน
             </button>
             <button (click)="setFilter('yearly')"
                [class]="'px-4 py-2 text-sm font-medium rounded-lg transition-all ' + (filterType() === 'yearly' ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400')">
                รายปี
             </button>
        </div>
      </header>

      <!-- 1. Summary Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-summary-card
          title="ยอดคงเหลือปัจจุบัน"
          [amount]="summaryStats().balance"
          type="balance"
        ></app-summary-card>
        <app-summary-card
          title="รายรับรวม (เดือนนี้)"
          [amount]="summaryStats().income"
          type="income"
        ></app-summary-card>
        <app-summary-card
          title="รายจ่ายรวม (เดือนนี้)"
          [amount]="summaryStats().expense"
          type="expense"
        ></app-summary-card>
      </section>

      <!-- 2. Charts Section -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Expense Breakdown (Donut) -->
          <div class="lg:col-span-1 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                 <span class="material-icons-outlined text-rose-500">pie_chart</span>
                 สัดส่วนรายจ่าย
              </h3>
              @if (summaryStats().expense > 0) {
                   <app-expense-donut-chart [data]="expenseByCategory()"></app-expense-donut-chart>
              } @else {
                  <div class="h-64 flex flex-col items-center justify-center text-zinc-400">
                      <span class="material-icons-outlined text-4xl mb-2 opacity-50">data_usage</span>
                      <p>ยังไม่มีรายจ่ายเดือนนี้</p>
                  </div>
              }
          </div>

          <!-- Cash Flow Trend (Bar/Line) -->
          <div class="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
               <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                 <span class="material-icons-outlined text-blue-500">timeline</span>
                 แนวโน้มการใช้เงิน (รายวัน)
               </h3>
               <app-cash-flow-chart [data]="dailyCashFlowData()"></app-cash-flow-chart>
          </div>
      </section>

      <!-- 3. Recent Transactions -->
      <section>
         <h3 class="text-lg font-semibold text-zinc-900 dark:text-white mb-4">รายการล่าสุด</h3>
         <app-recent-transactions [transactions]="recentTransactions()"></app-recent-transactions>
      </section>

    </div>
  `
})
export class DashboardComponent {
  private reportService = inject(ReportApiService);
  private transactionService = inject(TransactionApiService);
  private debtService = inject(DebtApiService);
  private authService = inject(AuthService);
  private dataService = inject(DataService);

  user = this.authService.user;

  filterType = signal<'daily' | 'monthly' | 'yearly'>('daily'); // daily = this month, monthly = this year, yearly = all time

  private dateParams = computed(() => {
    const type = this.filterType();
    const bookId = this.dataService.currentBook()?.id;
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;
    let groupBy: 'day' | 'month' | 'year' = 'day';

    if (type === 'daily') {
      // This Month (Group by Day)
      groupBy = 'day';
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (type === 'monthly') {
      // This Year (Group by Month)
      groupBy = 'month';
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
    } else {
      // All Time (Group by Year)
      groupBy = 'year';
      startDate = undefined;
      endDate = undefined;
    }
    return { startDate, endDate, groupBy, bookId };
  });

  // Real API Data
  private dateParams$ = toObservable(this.dateParams);

  // Real API Data
  summaryStats = toSignal(
    this.dateParams$.pipe(
      switchMap(params => this.reportService.getSummary(params)),
      catchError(() => of({ income: 0, expense: 0, balance: 0 } as ReportSummary))
    ),
    { initialValue: { income: 0, expense: 0, balance: 0 } as ReportSummary }
  );

  categoryPieData = toSignal(
    this.dateParams$.pipe(
      switchMap(params => this.reportService.getCategoryPie(params)),
      catchError(() => of([] as CategoryPieData[]))
    ),
    { initialValue: [] as CategoryPieData[] }
  );

  dailyCashFlowData = toSignal(
    this.dateParams$.pipe(
      switchMap(params => this.reportService.getDailyCashFlow(params)),
      catchError(() => of([] as DailyCashFlow[]))
    ),
    { initialValue: [] as DailyCashFlow[] }
  );

  recentTransactions = toSignal(
    toObservable(this.dataService.currentBook).pipe(
      switchMap(book => this.transactionService.getTransactions(undefined, book?.id)),
      catchError(() => of([]))
    ),
    { initialValue: [] as Transaction[] }
  );

  debts = toSignal(
    toObservable(this.dataService.currentBook).pipe(
      switchMap(book => this.debtService.getDebts(undefined, book?.id)),
      catchError(() => of([]))
    ),
    { initialValue: [] as Debt[] }
  );


  totalBalance = computed(() => this.summaryStats()?.balance || 0); // Handle potential null if switch is weird
  monthlyIncome = computed(() => this.summaryStats()?.income || 0);
  monthlyExpense = computed(() => this.summaryStats()?.expense || 0);


  // Chart Data
  expenseByCategory = computed(() => {
    return (this.categoryPieData() || []).map(item => ({
      name: item.category,
      value: item.amount,
      color: item.color
    }));
  });

  setFilter(type: 'daily' | 'monthly' | 'yearly') {
    this.filterType.set(type);
  }
}
