import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans relative overflow-hidden transition-colors duration-500">
      
      <!-- Ambient Background Effects -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute top-1/2 -right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      <div class="absolute -bottom-32 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow delay-700"></div>

      <div class="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in duration-500">
        <!-- Logo / Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
          </div>
          <h1 class="text-4xl font-black bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent tracking-tight mb-2">ยินดีต้อนรับ</h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm">เข้าสู่ระบบเพื่อจัดการรายจ่ายของคุณ</p>
        </div>

        <!-- Card -->
        <div class="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-zinc-800 p-8">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
                
                <!-- Username Field -->
                <div class="space-y-2">
                    <label for="username" class="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">ชื่อผู้ใช้</label>
                    <div class="relative group">
                         <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <input id="username" formControlName="username" type="text" autocomplete="username" 
                            class="block w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-zinc-400 dark:text-white"
                            [class.border-red-500]="isFieldInvalid('username')"
                            placeholder="กรอกชื่อผู้ใช้">
                    </div>
                     @if (isFieldInvalid('username')) {
                         <p class="text-red-500 text-xs ml-1 animate-in slide-in-from-top-1">กรุณากรอกชื่อผู้ใช้</p>
                    }
                </div>

                <!-- Password Field -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                         <label for="password" class="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">รหัสผ่าน</label>
                    </div>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <input id="password" formControlName="password" type="password" autocomplete="current-password"
                             class="block w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-zinc-400 dark:text-white"
                             [class.border-red-500]="isFieldInvalid('password')"
                             placeholder="••••••••">
                    </div>
                     @if (isFieldInvalid('password')) {
                         <p class="text-red-500 text-xs ml-1 animate-in slide-in-from-top-1">กรุณากรอกรหัสผ่าน</p>
                    }
                </div>

                <!-- Error Message -->
                @if (errorMessage()) {
                     <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-2 animate-in zoom-in duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                         <span>{{ errorMessage() }}</span>
                     </div>
                }

                <!-- Submit Button -->
                <button type="submit" [disabled]="loading()"
                    class="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-500/20">
                    @if (loading()) {
                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังเข้าสู่ระบบ...
                    } @else {
                        เข้าสู่ระบบ
                    }
                </button>
            </form>
        </div>
        
        <p class="text-center text-xs text-zinc-400 mt-8">
            &copy; 2025 RaiJai Application. All rights reserved.
        </p>
      </div>
    </div>
    `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login({ username: username!, password: password! })
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
          console.error('Login error', err);
        }
      });
  }
}
