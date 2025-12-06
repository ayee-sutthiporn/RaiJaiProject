import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { ExpenseDonutChartComponent } from './components/expense-donut-chart/expense-donut-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent, RecentTransactionsComponent, DecimalPipe, ExpenseDonutChartComponent],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">ภาพรวมกระเป๋าเงิน</h1>
          <p class="text-zinc-500 dark:text-zinc-400">ยินดีต้อนรับกลับ, {{ dataService.user().name }}</p>
        </div>
        <div class="md:text-right bg-white dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm w-full md:w-auto">
            <p class="text-xs text-zinc-400">ทรัพย์สินสุทธิ (Net Worth)</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-white font-mono tracking-tight">{{ dataService.totalBalance() | number:'1.2-2' }} บาท</p>
        </div>
      </header>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <app-summary-card
          title="เงินคงเหลือรวม"
          [amount]="dataService.totalBalance()"
          type="balance"
        ></app-summary-card>
        <app-summary-card
          title="รายรับเดือนนี้"
          [amount]="dataService.monthlyIncome()"
          type="income"
          [trend]="12"
        ></app-summary-card>
        <app-summary-card
          title="รายจ่ายเดือนนี้"
          [amount]="dataService.monthlyExpense()"
          type="expense"
          [trend]="-5"
        ></app-summary-card>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Transactions -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <app-recent-transactions [transactions]="dataService.transactions()"></app-recent-transactions>
        </div>

        <!-- Right Side Stats / Reminders -->
        <div class="space-y-6">
             <!-- Expense Chart Card -->
            <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h3 class="font-bold text-zinc-900 dark:text-white mb-4">สัดส่วนรายจ่าย</h3>
                <app-expense-donut-chart [data]="dataService.expenseByCategory()"></app-expense-donut-chart>
            </div>

            <!-- Recurring/Debts -->
           <div class="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <h3 class="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    รายจ่ายที่ต้องชำระ (หนี้/ผ่อน)
                </h3>
                <div class="space-y-4">
                    @for(debt of dataService.debts(); track debt.id) {
                         <div class="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-700/30">
                            <div>
                                <p class="text-sm font-medium text-zinc-900 dark:text-white">{{ debt.personName }}</p>
                                <p class="text-xs text-zinc-500">{{ debt.title }}</p>
                            </div>
                             <div class="text-right">
                                 <p class="font-medium text-zinc-900 dark:text-white text-sm">-{{ debt.installmentPlan?.monthlyAmount | number}}</p>
                                 <p class="text-[10px] text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full inline-block mt-1">ครบกำหนดใน 5 วัน</p>
                             </div>
                         </div>
                    } @empty {
                        <p class="text-sm text-zinc-400">ไม่มีรายการที่ต้องชำระ</p>
                    }
                </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  dataService = inject(MockDataService);
}
