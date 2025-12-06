import { Component, inject, signal } from '@angular/core';
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
          <div class="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
              <h3 class="font-bold text-lg mb-6 text-zinc-900 dark:text-white">ข้อมูลส่วนตัว</h3>
              
              <div class="flex items-center gap-6 mb-8">
                  <div class="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-zinc-700 overflow-hidden">
                      <img [src]="dataService.user().avatarUrl" class="w-full h-full object-cover">
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
                          <label class="block text-xs font-medium text-zinc-500 mb-1">ชื่อที่แสดง</label>
                          <input type="text" formControlName="name" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      <div>
                          <label class="block text-xs font-medium text-zinc-500 mb-1">อีเมล</label>
                          <input type="email" formControlName="email" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                  </div>
                  
                  <div class="flex justify-end pt-4">
                       <button type="submit" [disabled]="form.invalid || form.pristine" class="px-6 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                           บันทึกการเปลี่ยนแปลง
                       </button>
                  </div>
              </form>
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

  onSubmit() {
    if (this.form.valid) {
      // In a real app, calls API. Here we just pretend.
      alert('บันทึกข้อมูลเรียบร้อย!');
      this.form.markAsPristine();
    }
  }
}
