import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { NotificationService } from '../../core/services/notification.service';
import { DebtType, InstallmentPlan, Debt } from '../../core/models/debt.interface';

@Component({
    selector: 'app-debts',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           @for (debt of dataService.debts(); track debt.id) {
               <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                   <div class="flex justify-between items-start mb-4">
                       <div>
                           <span [class]="'text-xs font-bold px-2 py-1 rounded-md ' + (debt.type === 'BORROWED' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400')">
                               {{ debt.type === 'BORROWED' ? 'ต้องจ่ายคืน' : 'ต้องได้รับ' }}
                           </span>
                           <h3 class="font-bold text-lg mt-2 text-zinc-900 dark:text-white">{{ debt.title }}</h3>
                           <p class="text-zinc-500 text-sm">คู่สัญญา: {{ debt.personName }}</p>
                       </div>
                       <div class="flex gap-2">
                            <button (click)="openPayModal(debt)" class="text-zinc-400 hover:text-emerald-500 transition-colors" title="จ่าย/อัปเดตยอด">
                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                           </button>
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
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] overflow-y-auto">
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
           <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700">
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
                              @for (wallet of dataService.wallets(); track wallet.id) {
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
    </div>
  `
})
export class DebtsComponent {
    dataService = inject(MockDataService);
    notificationService = inject(NotificationService);
    fb = inject(FormBuilder);
    showModal = signal(false);
    editingId = signal<string | null>(null);

    form = this.fb.group({
        title: ['', Validators.required],
        type: ['BORROWED' as DebtType, Validators.required],
        amount: [0, [Validators.required, Validators.min(1)]],
        personName: ['', Validators.required],
        // New Installment Fields
        isInstallment: [false],
        totalMonths: [1],
        interestRate: [0]
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
                isInstallment: debt.isInstallment,
                totalMonths: debt.installmentPlan?.totalMonths || 12,
                interestRate: debt.installmentPlan?.interestRate || 0
            });
        } else {
            this.editingId.set(null);
            this.form.reset({
                type: 'BORROWED',
                amount: 0,
                isInstallment: false,
                totalMonths: 12,
                interestRate: 0
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

    onSubmit() {
        if (this.form.valid) {
            const val = this.form.getRawValue();

            let installmentPlan: InstallmentPlan | undefined;

            if (val.isInstallment && val.totalMonths) {
                installmentPlan = {
                    totalMonths: val.totalMonths,
                    paidMonths: 0, // Reset paid months on full edit? Or keep? For simplicity, we might reset if it's a "create" mindset, but for edit...
                    // Ideally we should preserve paidMonths if editing.
                    // Let's get the original if editing.
                    interestRate: val.interestRate || 0,
                    startDate: new Date().toISOString(),
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

            const debtData: Omit<Debt, 'id'> = {
                title: val.title!,
                type: val.type as DebtType,
                totalAmount: val.amount!,
                remainingAmount: 0, // Initial value, will be calculated below 
                // COMPLEXITY: If user changes Total from 5000 to 6000, and remaining was 2000 (paid 3000), 
                // new remaining should be 6000 - 3000 = 3000? 
                // For now, let's just reset remaining to total if it is a fresh edit, OR keep logic simple:
                // If create: remaining = total
                // If edit: logic needed.
                personName: val.personName!,
                isInstallment: val.isInstallment || false,
                installmentPlan: installmentPlan,
                autoDeduct: false,
                walletId: 'w1'
            };

            if (this.editingId()) {
                const original = this.dataService.debts().find(d => d.id === this.editingId());
                if (original) {
                    // Recalculate remaining based on difference
                    // Or just simply: newTotal - (oldTotal - oldRemaining) = newRemaining
                    const paid = original.totalAmount - original.remainingAmount;
                    debtData.remainingAmount = val.amount! - paid;

                    if (debtData.remainingAmount < 0) debtData.remainingAmount = 0; // Safety
                } else {
                    debtData.remainingAmount = val.amount!;
                }

                this.dataService.updateDebt(this.editingId()!, debtData);
                this.notificationService.add({
                    title: 'บันทึกสำเร็จ',
                    message: `แก้ไขรายการหนี้ "${debtData.title}" เรียบร้อยแล้ว`,
                    type: 'success'
                });
            } else {
                debtData.remainingAmount = val.amount!;
                this.dataService.addDebt(debtData);
                this.notificationService.add({
                    title: 'บันทึกสำเร็จ',
                    message: `เพิ่มรายการหนี้ "${debtData.title}" เรียบร้อยแล้ว`,
                    type: 'success'
                });
            }

            this.closeModal();
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

    onPaySubmit() {
        if (this.payForm.valid && this.selectedDebt()) {
            const val = this.payForm.getRawValue();
            this.dataService.payInstallment(this.selectedDebt()!.id, val.amount!, val.walletId!);
            this.closePayModal();
            this.notificationService.add({
                title: 'ชำระเงินสำเร็จ',
                message: `ชำระยอด ${val.amount} บาท เรียบร้อยแล้ว`,
                type: 'success'
            });
        }
    }

    deleteDebt(id: string) {
        if (confirm('ลบรายการนี้?')) {
            this.dataService.deleteDebt(id);
            this.notificationService.add({
                title: 'ลบรายการสำเร็จ',
                message: 'ลบรายการหนี้สินเรียบร้อยแล้ว',
                type: 'warning'
            });
        }
    }
}
