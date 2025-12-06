import { Component, computed, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

export interface ChartSegment {
    name: string;
    value: number;
    color: string;
}

@Component({
    selector: 'app-expense-donut-chart',
    standalone: true,
    imports: [CommonModule, DecimalPipe],
    template: `
    <div class="relative flex items-center justify-center p-4">
      <!-- SVG Chart -->
      <svg viewBox="0 0 36 36" class="w-full h-full max-w-[200px] transform -rotate-90">
        <!-- Background Circle -->
        <path class="text-zinc-100 dark:text-zinc-800" 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" 
              stroke="currentColor" 
              stroke-width="3.8"/>
              
        <!-- Segments -->
        @for (seg of segments(); track seg.name) {
             <path [attr.stroke]="seg.color"
                   [attr.stroke-dasharray]="seg.dashArray"
                   [attr.stroke-dashoffset]="seg.offset"
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                   fill="none"
                   stroke-width="3.8"
                   class="transition-all duration-1000 ease-out hover:opacity-80 hover:stroke-[4]"
                   stroke-linecap="round" />
        }
      </svg>
      
      <!-- Inner Text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-xs text-zinc-400 font-medium">รวมรายจ่าย</span>
          <span class="text-lg font-bold text-zinc-900 dark:text-white">{{ totalValue() | number:'1.0-0' }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="grid grid-cols-2 gap-3 mt-2">
        @for (seg of segments(); track seg.name) {
            <div class="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" [style.backgroundColor]="seg.color"></div>
                    <span class="text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[80px]">{{ seg.name }}</span>
                </div>
                <span class="text-xs font-bold text-zinc-900 dark:text-white">{{ seg.value | number }}</span>
            </div>
        }
    </div>
  `
})
export class ExpenseDonutChartComponent {
    data = input.required<ChartSegment[]>();

    totalValue = computed(() => this.data().reduce((acc, curr) => acc + curr.value, 0));

    segments = computed(() => {
        let cumulativePercent = 0;
        const total = this.totalValue();

        return this.data().map(item => {
            const percent = (item.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const offset = 100 - cumulativePercent;
            cumulativePercent += percent;

            return {
                ...item,
                dashArray,
                offset
            };
        });
    });
}
