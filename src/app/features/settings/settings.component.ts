import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <header>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">ตั้งค่า</h1>
        <p class="text-zinc-500 dark:text-zinc-400">จัดการโปรไฟล์และข้อมูลส่วนตัว</p>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Card -->
          <div class="lg:col-span-2 space-y-8">
              <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <h3 class="font-bold text-lg mb-6 text-zinc-900 dark:text-white">ข้อมูลส่วนตัว</h3>
                  
                  <div class="flex items-center gap-6 mb-8">
                      <div class="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-zinc-700 overflow-hidden">
                          <img [src]="dataService.user().avatarUrl" alt="User Avatar" class="w-full h-full object-cover">
                      </div>
                      <div>
                          <button class="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                              เปลี่ยนรูปโปรไฟล์
                          </button>
                          <p class="text-xs text-zinc-400 mt-2">รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 2MB</p>
                      </div>
                  </div>

                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label for="displayName" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อที่แสดง</label>
                              <input id="displayName" type="text" formControlName="name" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                          </div>
                          <div>
                              <label for="displayEmail" class="block text-xs font-medium text-zinc-500 mb-1">อีเมล</label>
                              <input id="displayEmail" type="email" formControlName="email" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                          </div>
                      </div>
                      
                      <div class="flex justify-end pt-4">
                           <button type="submit" [disabled]="form.invalid || form.pristine" class="px-6 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                               บันทึกการเปลี่ยนแปลง
                           </button>
                      </div>
                  </form>
              </div>

               <!-- Category Management -->
               <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                   <h3 class="font-bold text-lg mb-4 text-zinc-900 dark:text-white">จัดการหมวดหมู่</h3>
                   
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
                       <button type="submit" [disabled]="categoryForm.invalid" class="w-full md:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                           เพิ่ม
                       </button>
                   </form>

                   <!-- List -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                       @for (cat of dataService.categories(); track cat.id) {
                           <div class="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors group">
                               <div class="flex items-center gap-3">
                                   <div class="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-full text-lg">
                                       {{ cat.icon || '📝' }}
                                   </div>
                                   <div>
                                       <p class="font-medium text-sm text-zinc-900 dark:text-white">{{ cat.name }}</p>
                                       <p class="text-[10px] uppercase font-bold tracking-wider" [class.text-rose-500]="cat.type === 'EXPENSE'" [class.text-emerald-500]="cat.type === 'INCOME'">
                                            {{ cat.type === 'EXPENSE' ? 'รายจ่าย' : 'รายรับ' }}
                                       </p>
                                   </div>
                               </div>
                               <button (click)="deleteCategory(cat.id)" class="text-zinc-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all" title="ลบ">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                               </button>
                           </div>
                       }
                   </div>
               </div>
          </div>

          <!-- Preferences -->
          <div class="space-y-6">
              <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <h3 class="font-bold text-lg mb-4 text-zinc-900 dark:text-white">การตั้งค่าอื่นๆ</h3>
                  <div class="space-y-3">
                      <div class="flex items-center justify-between p-2">
                          <span class="text-sm text-zinc-600 dark:text-zinc-400">สกุลเงินหลัก</span>
                          <span class="text-sm font-medium text-zinc-900 dark:text-white">THB (฿)</span>
                      </div>
                      <div class="flex items-center justify-between p-2">
                          <span class="text-sm text-zinc-600 dark:text-zinc-400">ภาษา</span>
                          <span class="text-sm font-medium text-zinc-900 dark:text-white">ไทย</span>
                      </div>
                      <div class="flex items-center justify-between p-2">
                           <span class="text-sm text-zinc-600 dark:text-zinc-400">เวอร์ชันแอป</span>
                           <span class="text-sm font-medium text-zinc-900 dark:text-white">1.0.0</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  dataService = inject(MockDataService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: [this.dataService.user().name, Validators.required],
    email: [this.dataService.user().email, [Validators.required, Validators.email]]
  });

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    type: ['EXPENSE', Validators.required],
    icon: ['']
  });

  onSubmit() {
    if (this.form.valid) {
      alert('บันทึกข้อมูลเรียบร้อย!');
      this.form.markAsPristine();
    }
  }

  onAddCategory() {
    if (this.categoryForm.valid) {
      const val = this.categoryForm.value;
      this.dataService.addCategory({
        name: val.name!,
        type: val.type as 'INCOME' | 'EXPENSE',
        icon: val.icon || '📝',
        color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' // Default color
      });
      this.categoryForm.reset({ type: 'EXPENSE' });
    }
  }

  deleteCategory(id: string) {
    if (confirm('ยืนยันการลบหมวดหมู่นี้?')) {
      this.dataService.deleteCategory(id);
    }
  }
}
