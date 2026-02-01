import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserApiService } from '../../core/services/api/user-api.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user.interface';

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
                      <div class="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white dark:ring-zinc-700 overflow-hidden select-none">
                          {{ userInitials() }}
                      </div>
                      <div>
                          <button class="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors" disabled>
                              เปลี่ยนรูปโปรไฟล์ (เร็วๆนี้)
                          </button>
                          <p class="text-xs text-zinc-400 mt-2">รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 2MB</p>
                      </div>
                  </div>

                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label for="displayName" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อจริง</label>
                              <input id="firstName" type="text" formControlName="firstName" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                          </div>
                           <div>
                              <label for="lastName" class="block text-xs font-medium text-zinc-500 mb-1">นามสกุล</label>
                              <input id="lastName" type="text" formControlName="lastName" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                          </div>
                      </div>
                      
                      <!-- Name alias field if needed, but we use First/Last mostly now, or just Name -->
                      <div>
                          <label for="displayName" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อที่แสดง</label>
                          <input id="displayName" type="text" formControlName="name" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>

                      <div>
                          <label for="displayEmail" class="block text-xs font-medium text-zinc-500 mb-1">อีเมล</label>
                          <input id="displayEmail" type="email" formControlName="email" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" readonly>
                          <p class="text-[10px] text-zinc-400 mt-1">อีเมลไม่สามารถแก้ไขได้</p>
                      </div>
                      
                      <div class="flex justify-end pt-4">
                           <button type="submit" [disabled]="form.invalid || isSubmitting()" class="px-6 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2">
                               @if(isSubmitting()) {
                                   <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                               }
                               บันทึกการเปลี่ยนแปลง
                           </button>
                      </div>
                  </form>
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
    authService = inject(AuthService);
    userService = inject(UserApiService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    isSubmitting = signal(false);

    userInitials = computed(() => {
        const u = this.authService.user();
        if (!u) return '';
        if (u.firstName && u.lastName) {
            return (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
        }
        if (u.name) {
            const parts = u.name.split(' ');
            if (parts.length >= 2) {
                return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
            }
            return u.name.charAt(0).toUpperCase();
        }
        return u.username?.charAt(0).toUpperCase() || '?';
    });

    form = this.fb.group({
        firstName: [this.authService.user()?.firstName || ''],
        lastName: [this.authService.user()?.lastName || ''],
        name: [this.authService.user()?.name || '', Validators.required],
        email: [{ value: this.authService.user()?.email || '', disabled: true }, [Validators.required, Validators.email]]
    });

    onSubmit() {
        if (this.form.valid) {
            this.isSubmitting.set(true);
            const val = this.form.getRawValue();

            // Note: Backend might expect only changed fields or specific map
            const updateData: Partial<User> = {
                firstName: val.firstName || undefined,
                lastName: val.lastName || undefined,
                name: val.name || undefined
            };

            this.userService.updateMe(updateData).subscribe({
                next: (updatedUser) => {
                    this.toastService.show({
                        type: 'success',
                        title: 'สำเร็จ',
                        message: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว'
                    });
                    this.isSubmitting.set(false);
                    // Force logout or better yet, update session?
                    // Ideally we update session. AuthService might need method for that.
                    // For now, let's just reload to fetch fresh 'me' from AuthInterceptor/Guard if that existed, 
                    // but AuthService loads from localStorage.
                    // We must update localStorage.
                    const currentUser = this.authService.user();
                    if (currentUser) {
                        const newUser = { ...currentUser, ...updatedUser };
                        localStorage.setItem('user', JSON.stringify(newUser));
                        window.location.reload(); // Simple way to refresh app state
                    }
                },
                error: (err) => {
                    console.error('Failed to update profile', err);
                    this.toastService.show({
                        type: 'error',
                        title: 'ผิดพลาด',
                        message: 'ไม่สามารถบันทึกข้อมูลได้'
                    });
                    this.isSubmitting.set(false);
                }
            });
        }
    }
}
