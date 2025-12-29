import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { Wallet, WalletType } from '../../core/models/wallet.interface';
import { HistoryListComponent } from '../../shared/components/history-list/history-list.component';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, HistoryListComponent],
  template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">กระเป๋าเงิน</h1>
          <p class="text-zinc-500 dark:text-zinc-400">จัดการกระเป๋าเงินและบัญชีธนาคาร</p>
        </div>
        <button (click)="openModal()" class="bg-zinc-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            เพิ่มกระเป๋า
        </button>
      </header>
      
      <!-- Wallet Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (wallet of dataService.wallets(); track wallet.id) {
            <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm relative group overflow-hidden">
                 <!-- Background Decoration -->
                 <div [class]="'absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -mr-10 -mt-10 ' + wallet.color"></div>
                 
                 <div class="flex justify-between items-start mb-4 relative z-10">
                     <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ' + wallet.color">
                        <!-- Icon Placeholder based on type -->
                        @if (wallet.type === 'CASH') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        } @else if (wallet.type === 'BANK') {
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M10 2a2 2 0 0 0-2 2v1"/><path d="M14 2a2 2 0 0 1 2 2v1"/><path d="M8 21h8"/><path d="m12 6 6 6H6l6-6Z"/></svg>
                        } @else {
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        }
                     </div>
                     <div class="flex gap-1">
                        <button (click)="openModal(wallet)" class="text-zinc-400 hover:text-emerald-500 transition-colors p-2" title="แก้ไข">
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button (click)="deleteWallet(wallet.id)" class="text-zinc-400 hover:text-red-500 transition-colors p-2" title="ลบกระเป๋า">
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                        <button (click)="openHistoryModal(wallet)" class="text-zinc-400 hover:text-blue-400 transition-colors p-2" title="ประวัติการแก้ไข">
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                        </button>
                     </div>
                 </div>

                 <h3 class="text-lg font-bold text-zinc-900 dark:text-white truncate">{{ wallet.name }}</h3>
                 <p class="text-sm text-zinc-500 mb-4">{{ getTypeLabel(wallet.type) }}</p>

                 <div class="flex items-end justify-between">
                     <p [class]="'text-2xl font-mono font-bold ' + (wallet.balance >= 0 ? 'text-zinc-900 dark:text-white' : 'text-red-500')">
                         {{ wallet.balance | number:'1.2-2' }}
                     </p>
                     <span class="text-xs text-zinc-400 font-medium">THB</span>
                 </div>
            </div>
        }
      </div>
      
      <!-- Add Modal -->
      @if (showModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700">
                  <h2 class="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{{ editingId() ? 'แก้ไขกระเป๋า' : 'เพิ่มกระเป๋าใหม่' }}</h2>
                  
                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                      <div>
                          <label for="wallet-name" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อบัญชี/กระเป๋า</label>
                          <input id="wallet-name" type="text" formControlName="name" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      
                      <div>
                          <label for="wallet-type" class="block text-xs font-medium text-zinc-500 mb-1">ประเภท</label>
                          <select id="wallet-type" formControlName="type" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                              <option value="CASH">เงินสด (Cash)</option>
                              <option value="BANK">ธนาคาร (Bank)</option>
                              <option value="CREDIT_CARD">บัตรเครดิต (Credit Card)</option>
                          </select>
                      </div>

                      <div>
                          <label for="wallet-balance" class="block text-xs font-medium text-zinc-500 mb-1">ยอดเงิน</label>
                          <input id="wallet-balance" type="number" formControlName="balance" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>

                      <div class="grid grid-cols-5 gap-2">
                          @for (color of colors; track color) {
                              <button type="button" (click)="selectColor(color)" [attr.aria-label]="'เลือก' + getColorLabel(color)" [class]="'w-8 h-8 rounded-full ' + color + (form.get('color')?.value === color ? ' ring-2 ring-offset-2 ring-zinc-500' : '')"></button>
                          }
                      </div>

                      <div class="flex gap-3 mt-6">
                          <button type="button" (click)="closeModal()" class="flex-1 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">ยกเลิก</button>
                          <button type="submit" [disabled]="form.invalid" class="flex-1 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">บันทึก</button>
                      </div>
                  </form>
              </div>
          </div>
      }
      
      <!-- History Modal -->
      @if (showHistoryModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[80vh] overflow-y-auto">
                  <div class="flex justify-between items-center mb-4">
                      <h2 class="text-xl font-bold text-zinc-900 dark:text-white">ประวัติการแก้ไข</h2>
                      <button (click)="closeHistoryModal()" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                      </button>
                  </div>
                  <div class="mb-4">
                      <p class="text-sm text-zinc-500">รายการ: <span class="font-medium text-zinc-900 dark:text-white">{{ selectedWalletForHistory()?.name }}</span></p>
                  </div>
                  
                  <app-history-list [history]="selectedWalletForHistory()?.history || []"></app-history-list>
              </div>
          </div>
      }
    </div>
  `
})
export class WalletsComponent {
  dataService = inject(MockDataService);
  fb = inject(FormBuilder);

  showModal = signal(false);
  editingId = signal<string | null>(null);

  showHistoryModal = signal(false);
  selectedWalletForHistory = signal<Wallet | null>(null);

  colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-orange-500', 'bg-zinc-500'];

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['CASH' as WalletType, Validators.required],
    balance: [0, Validators.required],
    color: ['bg-emerald-500']
  });

  openModal(wallet?: Wallet) {
    this.showModal.set(true);
    if (wallet) {
      this.editingId.set(wallet.id);
      this.form.patchValue({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance,
        color: wallet.color
      });
    } else {
      this.editingId.set(null);
      this.form.reset({ type: 'CASH', balance: 0, color: 'bg-emerald-500' });
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  selectColor(color: string) {
    this.form.patchValue({ color });
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'CASH': return 'เงินสด';
      case 'BANK': return 'บัญชีธนาคาร';
      case 'CREDIT_CARD': return 'บัตรเครดิต';
      default: return type;
    }
  }

  getColorLabel(color: string): string {
    if (color.includes('emerald')) return 'สีเขียว';
    if (color.includes('blue')) return 'สีน้ำเงิน';
    if (color.includes('purple')) return 'สีม่วง';
    if (color.includes('rose')) return 'สีแดงอมชมพู';
    if (color.includes('orange')) return 'สีส้ม';
    if (color.includes('zinc')) return 'สีเทา';
    return 'เลือกสี';
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.getRawValue();

      if (this.editingId()) {
        this.dataService.updateWallet(this.editingId()!, {
          name: val.name!,
          type: val.type!,
          balance: val.balance!,
          color: val.color!
        });
      } else {
        this.dataService.addWallet({
          name: val.name!,
          type: val.type!,
          balance: val.balance!,
          currency: 'THB',
          color: val.color!,
          ownerId: this.dataService.user().id
        });
      }
      this.closeModal();
    }
  }

  deleteWallet(id: string) {
    if (confirm('คุณแน่ใจว่าต้องการลบกระเป๋านี้?')) {
      this.dataService.deleteWallet(id);
    }
  }

  openHistoryModal(wallet: Wallet) {
    this.selectedWalletForHistory.set(wallet);
    this.showHistoryModal.set(true);
  }

  closeHistoryModal() {
    this.showHistoryModal.set(false);
    this.selectedWalletForHistory.set(null);
  }
}
