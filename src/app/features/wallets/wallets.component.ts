import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock/mock-data.service';
import { Wallet, WalletType } from '../../core/models/wallet.interface';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-wallets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, ConfirmModalComponent],
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
        @for (wallet of filteredWallets(); track wallet.id) {
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
                       <div class="flex gap-2">
                           <button (click)="openTransactionsModal(wallet.id)" class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors text-white" title="รายการเดินบัญชี">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                           </button>

                           <button (click)="openModal(wallet)" class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors text-white" title="แก้ไข">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                           </button>
                        <button (click)="deleteWallet(wallet.id)" class="text-zinc-400 hover:text-red-500 transition-colors p-2" title="ลบกระเป๋า">
                             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
                 
                 <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center gap-2">
                    <span class="bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ getOwnerName(wallet.ownerId) }}
                    </span>
                 </div>
            </div>
        }
      </div>
      
      <!-- Add Modal -->
      @if (showModal()) {
          <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 ease-out">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                  <button (click)="closeModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                  </button>
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
      
      <!-- Transactions Modal -->
    @if (showTransactionsModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 ease-out">
            <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[80vh] overflow-y-auto relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                 <button (click)="closeTransactionsModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                  </button>
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-zinc-900 dark:text-white">รายการเดินบัญชี</h2>
                </div>
                
                <div class="space-y-3">
                    @for (tx of selectedWalletTransactions(); track tx.id) {
                        <div class="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700">
                            <div class="flex items-center gap-3">
                                <div [class]="'p-2 rounded-full ' + (tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        @if(tx.type === 'INCOME') { <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/> } 
                                        @else { <path d="M12 5v14"/><path d="m19 12-7 7-7-7"/> }
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-bold text-sm text-zinc-900 dark:text-white">{{ tx.description || tx.category }}</p>
                                    <p class="text-xs text-zinc-500">{{ tx.date | date:'dd-MM-yyyy, HH:mm' }}</p>
                                </div>
                            </div>
                            <span [class]="'font-bold ' + (tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')">
                                {{ tx.type === 'INCOME' ? '+' : '-' }}{{ tx.amount | number }}
                            </span>
                        </div>
                    } @empty {
                         <div class="text-center py-8 text-zinc-400">ไม่มีรายการเคลื่อนไหว</div>
                    }
                </div>
            </div>
        </div>
    }

    <!-- Confirm Modal -->
    @if (confirmModalOpen()) {
        <app-confirm-modal
            [title]="'ยืนยันการลบกระเป๋าเงิน'"
            [message]="'คุณต้องการลบกระเป๋าเงินใบนี้ใช่หรือไม่? (ประวัติธุรกรรมที่เกี่ยวข้องทั้งหมดจะถูกลบไปด้วย) การกระทำนี้ไม่สามารถย้อนกลับได้'"
            (confirmed)="confirmDelete()"
            (cancelled)="confirmModalOpen.set(false)">
        </app-confirm-modal>
    }
  </div>
  `
})
export class WalletsComponent {
  dataService = inject(MockDataService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  showModal = signal(false);
  editingId = signal<string | null>(null);

  showTransactionsModal = signal(false);
  selectedWalletIdForTransactions = signal<string | null>(null);

  // Confirm Modal
  confirmModalOpen = signal(false);
  deleteId = signal<string | null>(null);

  filteredWallets = computed(() => {
    return this.dataService.wallets();
  });

  getOwnerName(ownerId?: string): string {
    if (!ownerId) return 'Unknown';
    const user = this.dataService.users().find(u => u.id === ownerId);
    return user ? user.name : 'Unknown';
  }

  selectedWalletTransactions = computed(() => {
    const walletId = this.selectedWalletIdForTransactions();
    if (!walletId) return [];
    return this.dataService.transactions()
      .filter(t => t.walletId === walletId)
      // Sort by date desc
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

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

  async onSubmit() {
    if (this.form.valid) {
      const val = this.form.getRawValue();

      try {
        if (this.editingId()) {
          await this.dataService.updateWallet(this.editingId()!, {
            name: val.name!,
            type: val.type!,
            balance: val.balance!,
            color: val.color!
          });
        } else {
          await this.dataService.addWallet({
            name: val.name!,
            type: val.type!,
            balance: val.balance!,
            currency: 'THB',
            color: val.color!,
            ownerId: this.dataService.currentUser()?.id
          });
        }
        this.closeModal();
        this.toastService.show({
          type: 'success',
          title: 'สำเร็จ',
          message: 'บันทึกข้อมูลกระเป๋าเงินเรียบร้อยแล้ว'
        });
      } catch (error) {
        console.error('Failed to save wallet:', error);
        this.toastService.show({
          type: 'error',
          title: 'ผิดพลาด',
          message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        });
      }
    }
  }

  deleteWallet(id: string) {
    this.deleteId.set(id);
    this.confirmModalOpen.set(true);
  }

  async confirmDelete() {
    if (this.deleteId()) {
      try {
        await this.dataService.deleteWallet(this.deleteId()!);
        this.confirmModalOpen.set(false);
        this.deleteId.set(null);
        this.toastService.show({
          type: 'success',
          title: 'สำเร็จ',
          message: 'ลบกระเป๋าเงินเรียบร้อยแล้ว'
        });
      } catch (error) {
        console.error('Failed to delete wallet:', error);
        this.toastService.show({
          type: 'error',
          title: 'ผิดพลาด',
          message: 'เกิดข้อผิดพลาดในการลบข้อมูล'
        });
      }
    }
  }

  openTransactionsModal(walletId: string) {
    this.selectedWalletIdForTransactions.set(walletId);
    this.showTransactionsModal.set(true);
  }

  closeTransactionsModal() {
    this.showTransactionsModal.set(false);
    this.selectedWalletIdForTransactions.set(null);
  }
}
