import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { NotificationDropdownComponent } from '../components/notification-dropdown.component';
import { NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationDropdownComponent],
    template: `
    <div class="flex h-screen bg-zinc-50 dark:bg-zinc-900 font-sans transition-colors duration-300">
      <!-- Sidebar (Desktop) -->
      <aside class="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 hidden md:flex flex-col shadow-xl z-20">
        <div class="p-6">
            <h1 class="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tighter">รายจ่าย</h1>
            <p class="text-xs text-zinc-400 mt-1 font-light">จัดการการเงินง่ายๆ</p>
        </div>
        
        <nav class="flex-1 px-4 space-y-2 mt-4">
            <a routerLink="/dashboard" routerLinkActive="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-sm" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span class="font-medium">ภาพรวม</span>
            </a>
            <a routerLink="/transactions" routerLinkActive="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-sm" class="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all group">
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
                <span class="font-medium">ธุรกรรม</span>
            </a>
            <a routerLink="/wallets" routerLinkActive="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-sm" class="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <span class="font-medium">กระเป๋าเงิน</span>
            </a>
             <a routerLink="/debts" routerLinkActive="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-sm" class="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all group">
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="font-medium">หนี้สิน</span>
            </a>
             <a routerLink="/settings" routerLinkActive="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-sm" class="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                <span class="font-medium">ตั้งค่า</span>
            </a>
        </nav>

        <div class="px-6 py-4">
             <!-- User Profile (Desktop Sidebar) -->
             <div class="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/30 rounded-xl border border-zinc-100 dark:border-zinc-700">
                 <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                     <img src="https://i.pravatar.cc/150?u=u1" alt="Profile" class="w-full h-full object-cover">
                 </div>
                 <div class="overflow-hidden">
                     <p class="text-sm font-bold text-zinc-900 dark:text-white truncate">สุทธิพร</p>
                     <p class="text-xs text-zinc-500 truncate">แพ็คเกจโปร</p>
                 </div>
             </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 relative">
        
        <!-- Desktop Header -->
        <header class="hidden md:flex items-center justify-between px-8 py-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
            <div>
                <h2 class="text-xl font-bold text-zinc-800 dark:text-white">ยินดีต้อนรับกลับ, สุทธิพร 👋</h2>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">จัดการการเงินของคุณได้ง่ายๆ วันนี้</p>
            </div>
            <div class="flex items-center gap-4">
                <button (click)="themeService.toggle()" class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    @if (themeService.darkMode()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    }
                </button>
                
                <div class="relative">
                    <button (click)="toggleNotifications()" class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                        @if (notificationService.unreadCount() > 0) {
                            <span class="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
                        }
                    </button>
                    @if (showNotifications()) {
                        <app-notification-dropdown (click)="toggleNotifications()"/>
                    }
                </div>
            </div>
        </header>

        <!-- Mobile Header (Updated with Notifications) -->
        <div class="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-30 shadow-sm">
            <h1 class="text-xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">รายจ่าย</h1>
            <div class="flex items-center gap-3">
                 <button (click)="themeService.toggle()" class="p-2 text-zinc-600 dark:text-zinc-300">
                    @if (themeService.darkMode()) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    }
                 </button>
                 
                 <div class="relative">
                    <button (click)="toggleNotifications()" class="p-2 text-zinc-600 dark:text-zinc-300 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                        @if (notificationService.unreadCount() > 0) {
                            <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
                        }
                    </button>
                     @if (showNotifications()) {
                        <app-notification-dropdown (click)="toggleNotifications()"/>
                    }
                 </div>

                 <button (click)="toggleMobileMenu()" class="text-zinc-600 dark:text-white ml-1">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                 </button>
            </div>
        </div>
      
        <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
             <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Mobile Sidebar Overlay (New Design) -->
      @if (isMobileMenuOpen()) {
        <div class="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                 (click)="toggleMobileMenu()"
                 [class.opacity-100]="isMobileMenuOpen()"
                 [class.opacity-0]="!isMobileMenuOpen()"></div>

            <!-- Side Panel -->
            <aside class="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-900 shadow-2xl flex flex-col transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
                   [class.translate-x-0]="isMobileMenuOpen()"
                   [class.-translate-x-full]="!isMobileMenuOpen()">
                
                <!-- Helper Close Button -->
                <button (click)="toggleMobileMenu()" class="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                </button>

                <!-- Profile Section -->
                <div class="p-8 pb-6 flex flex-col items-center text-center mt-6">
                    <div class="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-cyan-400 shadow-lg mb-4">
                         <img src="https://i.pravatar.cc/150?u=u1" alt="Profile" class="w-full h-full rounded-full object-cover border-4 border-white dark:border-zinc-900">
                    </div>
                    <h2 class="text-xl font-bold text-zinc-900 dark:text-white">สุทธิพร</h2>
                    <p class="text-sm text-zinc-500 dark:text-zinc-400">sutthiporn&#64;example.com</p>
                </div>

                <!-- Divider -->
                <div class="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-6"></div>
                
                <!-- Nav Links -->
                <nav class="flex-1 px-6 space-y-3">
                    <a routerLink="/dashboard" (click)="toggleMobileMenu()" routerLinkActive="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-4 px-4 py-3.5 text-zinc-600 dark:text-zinc-400 rounded-2xl transition-all active:scale-95 duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        <span class="font-medium">ภาพรวม</span>
                    </a>
                    <a routerLink="/transactions" (click)="toggleMobileMenu()" routerLinkActive="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" class="flex items-center gap-4 px-4 py-3.5 text-zinc-600 dark:text-zinc-400 rounded-2xl transition-all active:scale-95 duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                         <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
                        <span class="font-medium">ธุรกรรม</span>
                    </a>
                    <a routerLink="/wallets" (click)="toggleMobileMenu()" routerLinkActive="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" class="flex items-center gap-4 px-4 py-3.5 text-zinc-600 dark:text-zinc-400 rounded-2xl transition-all active:scale-95 duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                        <span class="font-medium">กระเป๋าเงิน</span>
                    </a>
                    <a routerLink="/debts" (click)="toggleMobileMenu()" routerLinkActive="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" class="flex items-center gap-4 px-4 py-3.5 text-zinc-600 dark:text-zinc-400 rounded-2xl transition-all active:scale-95 duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span class="font-medium">หนี้สิน</span>
                    </a>
                     <a routerLink="/settings" (click)="toggleMobileMenu()" routerLinkActive="bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" class="flex items-center gap-4 px-4 py-3.5 text-zinc-600 dark:text-zinc-400 rounded-2xl transition-all active:scale-95 duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span class="font-medium">ตั้งค่า</span>
                    </a>
                </nav>

                <!-- Footer -->
                 <div class="p-6">
                    <button (click)="themeService.toggle()" class="w-full flex items-center justify-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors gap-2">
                        @if (themeService.darkMode()) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                            <span>โหมดมืด</span>
                        } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                            <span>โหมดสว่าง</span>
                        }
                     </button>
                    <p class="text-[10px] text-center text-zinc-400 mt-6">RaiJai App v1.0.0</p>
                </div>
            </aside>
        </div>
      }
    </div>
  `
})
export class MainLayoutComponent {
    themeService = inject(ThemeService);
    notificationService = inject(NotificationService);
    isMobileMenuOpen = signal(false);
    showNotifications = signal(false);

    toggleMobileMenu() {
        this.isMobileMenuOpen.update(v => !v);
    }

    toggleNotifications() {
        this.showNotifications.update(v => !v);
    }
}
