import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { TransactionType } from '../../../../core/models/transaction.interface';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 w-full">
      <h2 class="text-xl font-bold mb-6 text-zinc-900 dark:text-white">ทำรายการใหม่</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        
        <!-- Type Switcher -->
        <div class="grid grid-cols-3 gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
          @for (type of types; track type) {
            <button type="button" 
              (click)="setType(type)"
              [class]="'py-2 px-3 rounded-lg text-sm font-medium transition-all ' + (currentType() === type ? getActiveClass(type) : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300')">
              {{ getTypeLabel(type) }}
            </button>
          }
        </div>

        <!-- Amount -->
        <div>
          <label for="amount" class="block text-xs font-medium text-zinc-500 mb-1">จำนวนเงิน</label>
          <div class="relative">
            <input id="amount" type="number" formControlName="amount" 
              class="w-full text-2xl font-bold bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 focus:outline-none py-2 px-1 placeholder-zinc-300 dark:placeholder-zinc-600 dark:text-white"
              placeholder="0.00" autoFocus>
            <span class="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">บาท</span>
          </div>
        </div>

        <!-- Date -->
        <div>
             <label for="date" class="block text-xs font-medium text-zinc-500 mb-1">วันที่และเวลา</label>
            <input id="date" type="datetime-local" formControlName="date"
             class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none dark:text-white">
        </div>

        <!-- Wallet Selection -->
        <div>
            <label for="walletId" class="block text-xs font-medium text-zinc-500 mb-1">บัญชี/กระเป๋า</label>
            <select id="walletId" formControlName="walletId" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none dark:text-white">
                @for (wallet of dataService.wallets(); track wallet.id) {
                    <option [value]="wallet.id">{{ wallet.name }} ({{ wallet.balance | number }} บาท)</option>
                }
            </select>
        </div>

        <!-- Transfer To Target (Conditional) -->
        @if (currentType() === 'TRANSFER') {
            <div class="animate-in fade-in slide-in-from-top-2">
                <label for="toWalletId" class="block text-xs font-medium text-zinc-500 mb-1">โอนไปยัง</label>
                <select id="toWalletId" formControlName="toWalletId" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none dark:text-white">
                     @for (wallet of dataService.wallets(); track wallet.id) {
                         @if (wallet.id !== form.get('walletId')?.value) {
                             <option [value]="wallet.id">{{ wallet.name }}</option>
                         }
                    }
                </select>
            </div>
        }

        <!-- Category -->
        @if (currentType() !== 'TRANSFER') {
            <div>
              <label for="category" class="block text-xs font-medium text-zinc-500 mb-1">หมวดหมู่</label>
              <select id="category" formControlName="category" class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none dark:text-white">
                @for (cat of categories(); track cat.id) {
                    <option [value]="cat.name">{{ cat.name }} {{ cat.icon }}</option>
                }
              </select>
            </div>
        }

        <!-- Note -->
        <div>
             <label for="description" class="block text-xs font-medium text-zinc-500 mb-1">บันทึกช่วยจำ (ไม่บังคับ)</label>
            <input id="description" type="text" formControlName="description" 
            class="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none dark:text-white"
            placeholder="รายการนี้เกียวกับอะไร?">
        </div>

        <!-- Submit -->
        <button type="submit" 
            [disabled]="form.invalid"
            class="w-full bg-zinc-900 dark:bg-emerald-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-zinc-200 dark:shadow-none">
            บันทึกรายการ
        </button>

      </form>
    </div>
  `
})
export class TransactionFormComponent {
    dataService = inject(MockDataService);
    fb = inject(FormBuilder);
    formSubmitted = output<void>();

    types: TransactionType[] = ['INCOME', 'EXPENSE', 'TRANSFER'];
    currentType = signal<TransactionType>('EXPENSE');

    categories = this.dataService.categories;

    form: FormGroup = this.fb.group({
        amount: [null, [Validators.required, Validators.min(1)]],
        date: [new Date().toISOString().slice(0, 16), Validators.required],
        type: ['EXPENSE', Validators.required],
        walletId: ['', Validators.required],
        toWalletId: [''],
        category: ['อาหาร'],
        description: ['']
    });

    constructor() {
        const wallets = this.dataService.wallets();
        if (wallets.length > 0) {
            this.form.patchValue({ walletId: wallets[0].id });
        }
    }

    setType(type: TransactionType) {
        this.currentType.set(type);
        this.form.patchValue({ type });

        if (type === 'TRANSFER') {
            this.form.get('category')?.disable();
            this.form.get('toWalletId')?.setValidators(Validators.required);
        } else {
            this.form.get('category')?.enable();
            this.form.get('toWalletId')?.clearValidators();
        }
        this.form.get('toWalletId')?.updateValueAndValidity();
    }

    getTypeLabel(type: TransactionType): string {
        switch (type) {
            case 'INCOME': return 'รายรับ';
            case 'EXPENSE': return 'รายจ่าย';
            case 'TRANSFER': return 'โอนเงิน';
            default: return type;
        }
    }

    getActiveClass(type: TransactionType): string {
        switch (type) {
            case 'INCOME': return 'bg-white dark:bg-zinc-800 shadow-sm text-emerald-600 dark:text-emerald-400';
            case 'EXPENSE': return 'bg-white dark:bg-zinc-800 shadow-sm text-rose-600 dark:text-rose-400';
            case 'TRANSFER': return 'bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400';
            default: return '';
        }
    }

    onSubmit() {
        if (this.form.valid) {
            const formVal = this.form.getRawValue();
            this.dataService.addTransaction({
                amount: formVal.amount,
                date: new Date(formVal.date).toISOString(),
                type: formVal.type,
                walletId: formVal.walletId,
                toWalletId: formVal.toWalletId,
                category: formVal.type === 'TRANSFER' ? 'โอนเงิน' : formVal.category,
                description: formVal.description
            });

            this.form.patchValue({
                amount: null,
                description: ''
            });
            this.formSubmitted.emit();
            alert('บันทึกเรียบร้อย!');
        }
    }
}
