import { Component, computed, input } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

export interface DailyFlow {
    date: string;
    income: number;
    expense: number;
}

@Component({
    selector: 'app-cash-flow-chart',
    standalone: true,
    imports: [CommonModule, DecimalPipe, DatePipe],
    template: `
    <div class="w-full h-64 flex flex-col">
        @if (processedData().length === 0) {
             <div class="h-full flex items-center justify-center text-zinc-400 text-sm">ไม่มีข้อมูลสำหรับเดือนนี้</div>
        } @else {
            <div class="flex-1 flex items-end justify-between gap-1 relative pt-6 pl-8 pb-6 pr-2">
                <!-- Y-axis Grid -->
                <div class="absolute inset-0 pointer-events-none flex flex-col justify-between pl-8 pb-6 pr-2">
                    <div class="border-b border-dashed border-zinc-200 dark:border-zinc-700 w-full h-[1px]"></div>
                    <div class="border-b border-dashed border-zinc-200 dark:border-zinc-700 w-full h-[1px]"></div>
                    <div class="border-b border-dashed border-zinc-200 dark:border-zinc-700 w-full h-[1px]"></div>
                    <div class="border-b border-zinc-300 dark:border-zinc-600 w-full h-[1px]"></div>
                </div>
                 <!-- Y-axis Label -->
                 <div class="absolute top-0 left-0 text-[10px] text-zinc-400">{{ maxValue() | number:'1.0-0' }}</div>

                @for (d of processedData(); track d.date) {
                    <div class="flex-1 flex flex-col items-center justify-end h-full gap-[1px] group relative hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
                         
                        <!-- Bars Container -->
                        <div class="w-full flex justify-center items-end gap-[2px] h-full px-[2px]">
                            <!-- Income Bar -->
                            <div class="w-2 md:w-3 bg-emerald-500 rounded-t-sm transition-all duration-500 hover:brightness-110" 
                                 [style.height.%]="(d.income / maxValue()) * 100"
                                 [title]="'รายรับ: ' + (d.income | number)"></div>
                            <!-- Expense Bar -->
                            <div class="w-2 md:w-3 bg-red-500 rounded-t-sm transition-all duration-500 hover:brightness-110" 
                                 [style.height.%]="(d.expense / maxValue()) * 100"
                                 [title]="'รายจ่าย: ' + (d.expense | number)"></div>
                        </div>

                        <!-- Date Label -->
                         <div class="text-[10px] text-zinc-400 mt-2 rotate-0 truncate w-full text-center">
                              {{ d.day }}
                         </div>

                         <!-- Tooltip -->
                         <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap hidden sm:block">
                             <div class="font-bold mb-1">{{ d.fullDate | date:'mediumDate' }}</div>
                             <div class="text-emerald-400">รายรับ: +{{ d.income | number }}</div>
                             <div class="text-red-400">รายจ่าย: -{{ d.expense | number }}</div>
                         </div>
                    </div>
                }
            </div>
        }
    </div>
  `
})
export class CashFlowChartComponent {
    data = input.required<DailyFlow[]>();

    processedData = computed(() => {
        return (this.data() || []).map(d => ({
            ...d,
            day: new Date(d.date).getDate(),
            fullDate: new Date(d.date)
        }));
    });

    maxValue = computed(() => {
        const max = Math.max(...(this.data() || []).map(d => Math.max(d.income, d.expense)), 100);
        return max * 1.1; // Add 10% buffering
    });
}
