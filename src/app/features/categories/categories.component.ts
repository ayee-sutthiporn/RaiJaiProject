import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <header>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">จัดการหมวดหมู่</h1>
        <p class="text-zinc-500 dark:text-zinc-400">เพิ่ม ลบ แก้ไข หมวดหมู่รายรับรายจ่ายของคุณ</p>
      </header>
      
      <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm max-w-3xl">
           <!-- Add New -->
           <form [formGroup]="categoryForm" (ngSubmit)="onAddCategory()" class="flex flex-col md:flex-row gap-3 items-end mb-6 p-4 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl border border-zinc-100 dark:border-zinc-700">
               <div class="flex-1 w-full">
                   <label class="block text-xs font-medium text-zinc-500 mb-1">ชื่อหมวดหมู่</label>
                   <input type="text" formControlName="name" placeholder="เช่น ค่ากาแฟ" class="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
               </div>
               <div class="w-full md:w-32">
                   <label class="block text-xs font-medium text-zinc-500 mb-1">ประเภท</label>
                   <select formControlName="type" class="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                       <option value="EXPENSE">รายจ่าย</option>
                       <option value="INCOME">รายรับ</option>
                   </select>
                </div>
               <div class="w-full md:w-24">
                   <label class="block text-xs font-medium text-zinc-500 mb-1">ไอคอน</label>
                   <input type="text" formControlName="icon" placeholder="🍔" class="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white text-center">
               </div>
               <button type="submit" [disabled]="categoryForm.invalid" class="w-full md:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/20">
                   เพิ่ม
               </button>
           </form>

           <!-- List -->
           <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
               @for (cat of dataService.categories(); track cat.id) {
                   <div class="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors group">
                       <div class="flex items-center gap-3">
                           <div class="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-full text-xl shadow-inner">
                               {{ cat.icon || '📝' }}
                           </div>
                           <div>
                               <p class="font-medium text-sm text-zinc-900 dark:text-white">{{ cat.name }}</p>
                               <p class="text-[10px] uppercase font-bold tracking-wider" [class.text-rose-500]="cat.type === 'EXPENSE'" [class.text-emerald-500]="cat.type === 'INCOME'">
                                    {{ cat.type === 'EXPENSE' ? 'รายจ่าย' : 'รายรับ' }}
                               </p>
                           </div>
                       </div>
                       <button (click)="deleteCategory(cat.id)" class="text-zinc-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="ลบ">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                       </button>
                   </div>
               }
           </div>
      </div>
    </div>
  `,
    styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
  `]
})
export class CategoriesComponent {
    dataService = inject(MockDataService);
    fb = inject(FormBuilder);

    categoryForm = this.fb.group({
        name: ['', Validators.required],
        type: ['EXPENSE', Validators.required],
        icon: ['']
    });

    onAddCategory() {
        if (this.categoryForm.valid) {
            const val = this.categoryForm.value;
            this.dataService.addCategory({
                name: val.name!,
                type: val.type as 'INCOME' | 'EXPENSE',
                icon: val.icon || '📝',
                color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            });
            this.categoryForm.reset({ type: 'EXPENSE' });
        }
    }

    deleteCategory(id: string) {
        if (confirm('ยืนยันลบหมวดหมู่นี้? ประวัติการทำรายการเก่าๆ อาจได้รับผลกระทบ')) {
            this.dataService.deleteCategory(id);
        }
    }
}
