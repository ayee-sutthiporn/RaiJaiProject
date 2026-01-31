import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { DebtType, InstallmentPlan, Debt } from '../../core/models/debt.interface';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-debts',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DecimalPipe, ConfirmModalComponent],
    template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
       <header class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">หนี้สิน & การผ่อน</h1>
          <p class="text-zinc-500 dark:text-zinc-400">ติดตามรายการที่ต้องชำระหรือได้รับคืน</p>
        </div>
        <button (click)="openModal()" class="bg-zinc-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            เพิ่มรายการ
        </button>
      </header>

      <div class="flex gap-4 border-b border-zinc-200 dark:border-zinc-700 mb-6">
          <button (click)="activeTab.set('active')" [class]="'pb-2 px-4 text-sm font-medium transition-colors relative ' + (activeTab() === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200')">
              รายการคงค้าง
              @if(activeTab() === 'active') { <div class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div> }
          </button>
          <button (click)="activeTab.set('completed')" [class]="'pb-2 px-4 text-sm font-medium transition-colors relative ' + (activeTab() === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200')">
              ชำระครบแล้ว
              @if(activeTab() === 'completed') { <div class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full"></div> }
          </button>
      </div>

       <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           @for (debt of filteredDebts(); track debt.id) {
               <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm relative group">
                   @if (debt.remainingAmount === 0) {
                      <div class="absolute top-4 right-4 z-10">
                          <span class="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              ชำระครบแล้ว
                          </span>
                      </div>
                   }
                   <div class="flex justify-between items-start mb-4">
                       <div>
                           <span [class]="'text-xs font-bold px-2 py-1 rounded-md ' + (debt.type === 'BORROWED' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400')">
                               {{ debt.type === 'BORROWED' ? 'ต้องจ่ายคืน' : 'ต้องได้รับ' }}
                           </span>
                           <h3 class="font-bold text-lg mt-2 text-zinc-900 dark:text-white">{{ debt.title }}</h3>
                           <p class="text-zinc-500 text-sm">คู่สัญญา: {{ debt.personName }}</p>
                           @if (debt.remark) {
                               <p class="text-xs text-zinc-400 mt-1 flex items-start gap-1">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                   {{ debt.remark }}
                               </p>
                           }
                       </div>
                       <div class="flex gap-2">
                            @if (debt.remainingAmount > 0) {
                             <button (click)="openPayModal(debt)" class="text-zinc-400 hover:text-emerald-500 transition-colors" title="จ่าย/อัปเดตยอด">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </button>
                            }
                           <button (click)="openModal(debt)" class="text-zinc-400 hover:text-blue-500 transition-colors" title="แก้ไข">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                           </button>
                           <button (click)="deleteDebt(debt.id)" class="text-zinc-400 hover:text-red-500 transition-colors" title="ลบรายการ">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                           </button>
                       </div>
                   </div>

                   <div class="space-y-4">
                       <div>
                           <div class="flex justify-between text-sm mb-1 text-zinc-600 dark:text-zinc-400">
                               <span>คงเหลือ</span>
                               <span class="font-bold">{{ debt.remainingAmount | number }} / {{ debt.totalAmount | number }}</span>
                           </div>
                           <div class="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                               <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="(1 - debt.remainingAmount / debt.totalAmount) * 100"></div>
                           </div>
                       </div>

                       @if (debt.isInstallment && debt.installmentPlan) {
                           <div class="bg-zinc-50 dark:bg-zinc-700/30 p-4 rounded-xl text-sm border border-zinc-100 dark:border-zinc-700/50">
                               <div class="flex items-center gap-3 mb-3">
                                   <div class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-2 rounded-lg flex-shrink-0">
                                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                   </div>
                                   <div>
                                       <p class="font-bold text-zinc-900 dark:text-white text-base">ผ่อนเดือนละ {{ debt.installmentPlan.monthlyAmount | number }} บาท</p>
                                       <p class="text-xs text-zinc-500 dark:text-zinc-400">ดอกเบี้ย {{ debt.installmentPlan.interestRate }}% ต่อปี</p>
                                   </div>
                               </div>

                               <div class="grid grid-cols-2 gap-4 my-3 text-xs">
                                   <div class="bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                       <span class="block text-zinc-400 mb-1">จ่ายแล้ว</span>
                                       <span class="block font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                           {{ debt.installmentPlan.paidMonths }} งวด
                                       </span>
                                   </div>
                                   <div class="bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700">
                                      <span class="block text-zinc-400 mb-1">เหลืออีก</span>
                                      <span class="block font-bold text-orange-600 dark:text-orange-400 text-sm">
                                          {{ debt.installmentPlan.totalMonths - debt.installmentPlan.paidMonths }} งวด
                                      </span>
                                   </div>
                               </div>

                               <div class="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                                  <span>ความคืบหน้า</span>
                                  <span>{{ (debt.installmentPlan.paidMonths / debt.installmentPlan.totalMonths) * 100 | number:'1.0-0' }}%</span>
                               </div>
                               <div class="h-1.5 w-full bg-zinc-200 dark:bg-zinc-600 rounded-full mt-1 overflow-hidden">
                                   <div class="h-full bg-emerald-500 rounded-full transition-all duration-500" [style.width.%]="(debt.installmentPlan.paidMonths / debt.installmentPlan.totalMonths) * 100"></div>
                               </div>
                           </div>
                       }
                   </div>
               </div>
           } @empty {
               <div class="col-span-full text-center py-10 text-zinc-400">ยังไม่มีรายการหนี้สิน</div>
           }
      </div>

       <!-- Add Modal -->
      @if (showModal()) {
          <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 ease-out">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                  <button (click)="closeModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                  </button>
                  <h2 class="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{{ editingId() ? 'แก้ไขรายการหนี้สิน' : 'เพิ่มรายการหนี้สิน' }}</h2>
                  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                       <div>
                          <label for="debtTitle" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อรายการ</label>
                          <input id="debtTitle" type="text" formControlName="title" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      <div>
                          <label for="debtType" class="block text-xs font-medium text-zinc-500 mb-1">ประเภท</label>
                          <select id="debtType" formControlName="type" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                              <option value="BORROWED">ยืมมา (ต้องคืน)</option>
                              <option value="LENT">ให้ยืม (ต้องได้คืน)</option>
                          </select>
                      </div>
                      <div>
                          <label for="debtAmount" class="block text-xs font-medium text-zinc-500 mb-1">จำนวนเงินรวม</label>
                          <input id="debtAmount" type="number" formControlName="amount" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      <div>
                          <label for="personName" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อคู่สัญญา</label>
                          <input id="personName" type="text" formControlName="personName" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      <div>
                          <label for="debtRemark" class="block text-xs font-medium text-zinc-500 mb-1">หมายเหตุ (Remark)</label>
                          <textarea id="debtRemark" formControlName="remark" rows="2" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"></textarea>
                      </div>

                      <div class="pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
                           <div class="flex items-center gap-2 mb-3">
                               <input type="checkbox" id="isInstallment" formControlName="isInstallment" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                               <label for="isInstallment" class="text-sm font-medium text-zinc-700 dark:text-zinc-300">ผ่อนชำระ (Installment)</label>
                           </div>

                           @if (form.get('isInstallment')?.value) {
                               <div class="space-y-3 pl-6 animate-in slide-in-from-top-2 duration-200">
                                   <div class="grid grid-cols-2 gap-3">
                                       <div>
                                            <label for="totalMonths" class="block text-xs font-medium text-zinc-500 mb-1">จำนวนงวด</label>
                                            <input id="totalMonths" type="number" formControlName="totalMonths" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                       </div>
                                       <div>
                                            <label for="interestRate" class="block text-xs font-medium text-zinc-500 mb-1">ดอกเบี้ย (%)</label>
                                            <input id="interestRate" type="number" formControlName="interestRate" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                       </div>
                                   </div>
                                   <div>
                                        <label for="startDate" class="block text-xs font-medium text-zinc-500 mb-1">วันที่เริ่มผ่อน</label>
                                        <div class="relative">
                                            <input id="startDate" type="date" formControlName="startDate" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white relative z-10 appearance-none cursor-pointer">
                                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none z-0 material-icons-outlined text-[18px]">calendar_today</span>
                                        </div>
                                   </div>
                                    <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                       <p class="text-xs text-blue-600 dark:text-blue-400">
                                           ยอดผ่อนต่อเดือน (ประมาณ): <span class="font-bold">{{ calculateMonthlyPayment() | number:'1.0-2' }}</span> บาท
                                       </p>
                                   </div>
                               </div>
                           }
                      </div>
                      
                      <div class="flex gap-3 mt-6">
                          <button type="button" (click)="closeModal()" class="flex-1 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">ยกเลิก</button>
                          <button type="submit" [disabled]="form.invalid" class="flex-1 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">บันทึกรายการ</button>
                      </div>
                  </form>
              </div>
          </div>
      }

      <!-- Payment Modal -->
      @if (payModalOpen()) {
           <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 ease-out">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                  <button (click)="closePayModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                  </button>
                  <h2 class="text-xl font-bold mb-4 text-zinc-900 dark:text-white">ชำระหนี้ / ค่างวด</h2>
                  <p class="text-sm text-zinc-500 mb-6">รายการ: {{ selectedDebt()?.title }}</p>

                  <form [formGroup]="payForm" (ngSubmit)="onPaySubmit()" class="space-y-4">
                       <div>
                          <label for="payAmount" class="block text-xs font-medium text-zinc-500 mb-1">จำนวนเงินที่ชำระ</label>
                          <input id="payAmount" type="number" formControlName="amount" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                      </div>
                      
                      <div>
                          <label for="payWalletId" class="block text-xs font-medium text-zinc-500 mb-1">ชำระด้วยบัญชี/กระเป๋า</label>
                          <select id="payWalletId" formControlName="walletId" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                              @for (wallet of userWallets(); track wallet.id) {
                                  <option [value]="wallet.id">{{ wallet.name }} ({{ wallet.balance | number }})</option>
                              }
                          </select>
                      </div>

                       <div class="flex gap-3 mt-6">
                          <button type="button" (click)="closePayModal()" class="flex-1 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">ยกเลิก</button>
                          <button type="submit" [disabled]="payForm.invalid" class="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">ยืนยันการชำระ</button>
                      </div>
                  </form>
              </div>
           </div>
       }
       
       <!-- Confirm Modal -->
        @if (confirmModalOpen()) {
            <app-confirm-modal
                [title]="'ยืนยันการลบรายการ'"
                [message]="'คุณต้องการลบรายการนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้'"
                (confirmed)="confirmDelete()"
                (cancelled)="confirmModalOpen.set(false)">
            </app-confirm-modal>
        }

     </div>
  `
})
export class DebtsComponent {
    dataService = inject(MockDataService);
    notificationService = inject(NotificationService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);
    showModal = signal(false);
    editingId = signal<string | null>(null);
    activeTab = signal<'active' | 'completed'>('active');

    // Confirm Modal
    confirmModalOpen = signal(false);
    deleteId = signal<string | null>(null);

    filteredDebts = computed(() => {
        const userId = this.dataService.currentUser().id;
        const debts = this.dataService.debts().filter(d => d.ownerId === userId);
        if (this.activeTab() === 'active') {
            return debts.filter(d => d.remainingAmount > 0);
        } else {
            return debts.filter(d => d.remainingAmount === 0);
        }
    });

    userWallets = computed(() => {
        const userId = this.dataService.currentUser().id;
        return this.dataService.wallets().filter(w => w.ownerId === userId);
    });

    form = this.fb.group({
        title: ['', Validators.required],
        type: ['BORROWED' as DebtType, Validators.required],
        amount: [0, [Validators.required, Validators.min(1)]],
        personName: ['', Validators.required],
        remark: [''],
        isInstallment: [false],
        totalMonths: [1],
        interestRate: [0],
        startDate: [new Date().toISOString().split('T')[0]]
    });

    payForm = this.fb.group({
        amount: [0, [Validators.required, Validators.min(1)]],
        walletId: ['', Validators.required]
    });

    payModalOpen = signal(false);
    selectedDebt = signal<Debt | null>(null);



    openModal(debt?: Debt) {
        this.showModal.set(true);
        if (debt) {
            this.editingId.set(debt.id);
            this.form.patchValue({
                title: debt.title,
                type: debt.type,
                amount: debt.totalAmount, // Note: Should we allow editing Total Amount easily? Yes for simplistic CRUD.
                personName: debt.personName,
                remark: debt.remark || '',
                isInstallment: debt.isInstallment,
                totalMonths: debt.installmentPlan?.totalMonths || 1,
                interestRate: debt.installmentPlan?.interestRate || 0,
                startDate: debt.installmentPlan?.startDate ? new Date(debt.installmentPlan.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            this.editingId.set(null);
            this.form.reset({
                type: 'BORROWED',
                amount: 0,
                isInstallment: false,
                totalMonths: 12,
                interestRate: 0,
                startDate: new Date().toISOString().split('T')[0]
            });
        }
    }

    // Alias for old call if any template used it, but template updated to use openModal
    openAddModal() {
        this.openModal();
    }

    closeModal() {
        this.showModal.set(false);
        this.editingId.set(null);
    }

    calculateMonthlyPayment(): number {
        const val = this.form.getRawValue();
        const amount = val.amount || 0;
        const months = val.totalMonths || 1;
        const interest = val.interestRate || 0;

        if (months <= 0) return 0;
        const totalInterest = amount * (interest / 100) * (months / 12);
        return (amount + totalInterest) / months;
    }

    async onSubmit() {
        if (this.form.valid) {
            const val = this.form.getRawValue();

            let installmentPlan: InstallmentPlan | undefined;

            if (val.isInstallment && val.totalMonths) {
                installmentPlan = {
                    totalMonths: val.totalMonths,
                    paidMonths: 0,
                    interestRate: val.interestRate || 0,
                    startDate: val.startDate || new Date().toISOString(),
                    monthlyAmount: this.calculateMonthlyPayment()
                };
            }

            // Handling PaidMonths Preservation
            if (this.editingId()) {
                const original = this.dataService.debts().find(d => d.id === this.editingId());
                if (original && original.installmentPlan && installmentPlan) {
                    installmentPlan.paidMonths = original.installmentPlan.paidMonths;
                    installmentPlan.startDate = original.installmentPlan.startDate;
                }
            }

            const debtData: Partial<Debt> = {
                title: val.title!,
                type: val.type as DebtType,
                totalAmount: val.amount!,
                remainingAmount: val.amount!, // Default for new
                personName: val.personName!,
                remark: val.remark || undefined,
                isInstallment: val.isInstallment || false,
                installmentPlan: installmentPlan,
                autoDeduct: false,
                walletId: this.dataService.wallets()[0]?.id || '' // Default wallet
            };

            try {
                if (this.editingId()) {
                    const original = this.dataService.debts().find(d => d.id === this.editingId());
                    if (original) {
                        const paid = original.totalAmount - original.remainingAmount;
                        debtData.remainingAmount = val.amount! - paid;
                        if (debtData.remainingAmount < 0) debtData.remainingAmount = 0;
                    } else {
                        debtData.remainingAmount = val.amount!;
                    }

                    await this.dataService.updateDebt(this.editingId()!, debtData);
                    this.notificationService.add({
                        title: 'บันทึกสำเร็จ',
                        message: `แก้ไขรายการหนี้ "${debtData.title}" เรียบร้อยแล้ว`,
                        type: 'success'
                    });
                } else {
                    debtData.remainingAmount = val.amount!;
                    await this.dataService.addDebt(debtData);
                    this.notificationService.add({
                        title: 'บันทึกสำเร็จ',
                        message: `เพิ่มรายการหนี้ "${debtData.title}" เรียบร้อยแล้ว`,
                        type: 'success'
                    });
                }
                this.closeModal();
            } catch (error) {
                console.error('Failed to save debt:', error);
                this.toastService.show({
                    type: 'error',
                    title: 'ผิดพลาด',
                    message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
                });
            }
        }
    }

    openPayModal(debt: Debt) {
        this.selectedDebt.set(debt);
        const monthlyAmount = debt.installmentPlan ? debt.installmentPlan.monthlyAmount : debt.remainingAmount;

        // Auto-select first wallet if available
        const firstWalletId = this.dataService.wallets().length > 0 ? this.dataService.wallets()[0].id : '';

        this.payForm.patchValue({
            amount: monthlyAmount,
            walletId: firstWalletId
        });
        this.payModalOpen.set(true);
    }

    closePayModal() {
        this.payModalOpen.set(false);
        this.selectedDebt.set(null);
    }

    async onPaySubmit() {
        if (this.payForm.valid && this.selectedDebt()) {
            const val = this.payForm.getRawValue();
            try {
                await this.dataService.payInstallment(this.selectedDebt()!.id, val.amount!);
                this.closePayModal();
                this.notificationService.add({
                    title: 'ชำระเงินสำเร็จ',
                    message: `ชำระยอด ${val.amount} บาท เรียบร้อยแล้ว`,
                    type: 'success'
                });
            } catch (error) {
                console.error('Failed to pay debt:', error);
                this.toastService.show({
                    type: 'error',
                    title: 'ผิดพลาด',
                    message: 'เกิดข้อผิดพลาดในการชำระเงิน'
                });
            }
        }
    }

    deleteDebt(id: string) {
        this.deleteId.set(id);
        this.confirmModalOpen.set(true);
    }

    async confirmDelete() {
        if (this.deleteId()) {
            try {
                await this.dataService.deleteDebt(this.deleteId()!);
                this.notificationService.add({
                    title: 'ลบรายการสำเร็จ',
                    message: 'ลบรายการหนี้สินเรียบร้อยแล้ว',
                    type: 'warning'
                });
                this.confirmModalOpen.set(false);
                this.deleteId.set(null);
            } catch (error) {
                console.error('Failed to delete debt:', error);
                this.toastService.show({
                    type: 'error',
                    title: 'ผิดพลาด',
                    message: 'เกิดข้อผิดพลาดในการลบรายการ'
                });
            }
        }
    }
}
