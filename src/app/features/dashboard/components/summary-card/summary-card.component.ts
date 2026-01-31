import { Component, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ title() }}</h3>
        <div [class]="'p-2 rounded-full ' + iconBgColor">
          <!-- Simple Icon Placeholder based on Type -->
          @if (type() === 'balance') {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          } @else if (type() === 'income') {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><polyline points="17 11 12 6 7 11"/><line x1="12" x2="12" y1="18" y2="6"/></svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><polyline points="7 13 12 18 17 13"/><line x1="12" x2="12" y1="6" y2="18"/></svg>
          }
        </div>
      </div>
      <div class="flex items-end justify-between">
        <div>
          <p class="text-2xl font-bold text-zinc-900 dark:text-white">{{ amount() | number:'1.2-2' }} THB</p>
          @if (trend()) {
            <p class="text-xs mt-1" [class.text-emerald-500]="trend()! > 0" [class.text-red-500]="trend()! < 0">
              {{ trend()! > 0 ? '+' : ''}}{{ trend() }}% จากเดือนที่แล้ว
            </p>
          }
        </div>
      </div>
    </div>
  `
})
export class SummaryCardComponent {
  title = input.required<string>();
  amount = input.required<number>();
  type = input.required<'balance' | 'income' | 'expense'>();
  trend = input<number>();

  get iconBgColor() {
    switch (this.type()) {
      case 'balance': return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'income': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'expense': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-zinc-100';
    }
  }
}
