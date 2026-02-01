import { Component, inject, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { ExpenseDonutChartComponent } from './components/expense-donut-chart/expense-donut-chart.component';
import { CashFlowChartComponent } from './components/cash-flow-chart/cash-flow-chart.component';
import { ReportApiService } from '../../core/services/api/report-api.service';
import { TransactionApiService } from '../../core/services/api/transaction-api.service';
import { DebtApiService } from '../../core/services/api/debt-api.service';
import { AuthService } from '../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { Transaction } from '../../core/models/transaction.interface';
import { Debt } from '../../core/models/debt.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, RecentTransactionsComponent, DecimalPipe, ExpenseDonutChartComponent, CashFlowChartComponent],
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

  user = this.authService.user;

  // Real API Data
  summaryStats = toSignal(this.reportService.getSummary().pipe(catchError(() => of({ income: 0, expense: 0, balance: 0 }))), { initialValue: { income: 0, expense: 0, balance: 0 } });

  categoryPieData = toSignal(this.reportService.getCategoryPie().pipe(catchError(() => of([]))), { initialValue: [] });

  dailyCashFlowData = toSignal(this.reportService.getDailyCashFlow().pipe(catchError(() => of([]))), { initialValue: [] });

  recentTransactions = toSignal(this.transactionService.getTransactions().pipe(catchError(() => of([]))), { initialValue: [] as Transaction[] });

  debts = toSignal(this.debtService.getDebts().pipe(catchError(() => of([]))), { initialValue: [] as Debt[] });


  totalBalance = computed(() => this.summaryStats().balance);
  monthlyIncome = computed(() => this.summaryStats().income);
  monthlyExpense = computed(() => this.summaryStats().expense);


  // Chart Data
  expenseByCategory = computed(() => {
    return this.categoryPieData().map(item => ({
      name: item.category,
      value: item.amount,
      color: item.color
    }));
  });
}
