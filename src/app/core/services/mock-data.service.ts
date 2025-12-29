import { Injectable, computed, signal, effect } from '@angular/core';
import { User } from '../models/user.interface';
import { Transaction } from '../models/transaction.interface';
import { Wallet } from '../models/wallet.interface';
import { Debt } from '../models/debt.interface';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    // Signals for State
    user = signal<User>({
        id: 'u1',
        name: 'สุทธิพร',
        email: 'test@example.com'
    });

    wallets = signal<Wallet[]>([
        { id: 'w1', name: 'กระเป๋าตังค์', balance: 1250.00, type: 'CASH', currency: 'THB', color: '#10b981', ownerId: 'u1' }, // Emerald
        { id: 'w2', name: 'KBANK', balance: 45000.50, type: 'BANK', currency: 'THB', color: '#0ea5e9', ownerId: 'u1' }, // Sky
        { id: 'w3', name: 'Credit Card', balance: -5000.00, type: 'CREDIT_CARD', currency: 'THB', color: '#f43f5e', ownerId: 'u1' } // Rose
    ]);

    transactions = signal<Transaction[]>([
        { id: 't1', amount: 55000, type: 'INCOME', category: 'Salary', date: new Date().toISOString(), walletId: 'w2', createdById: 'u1', description: 'เงินเดือน' },
        { id: 't2', amount: 150, type: 'EXPENSE', category: 'Food', date: new Date().toISOString(), walletId: 'w1', createdById: 'u1', description: 'อาหารกลางวัน' },
        { id: 't3', amount: 45, type: 'EXPENSE', category: 'Transport', date: new Date().toISOString(), walletId: 'w1', createdById: 'u1', description: 'ค่าbts' },
        { id: 't4', amount: 12000, type: 'EXPENSE', category: 'Utilities', date: new Date(Date.now() - 86400000).toISOString(), walletId: 'w2', createdById: 'u1', description: 'ผ่อนคอนโด' },
        { id: 't5', amount: 2500, type: 'EXPENSE', category: 'Shopping', date: new Date(Date.now() - 172800000).toISOString(), walletId: 'w3', createdById: 'u1', description: 'ซื้อของเข้าบ้าน' },
        { id: 't6', amount: 3500, type: 'INCOME', category: 'Freight', date: new Date(Date.now() - 200000).toISOString(), walletId: 'w2', createdById: 'u1', description: 'งานนอก' },
        { id: 't7', amount: 899, type: 'EXPENSE', category: 'Food', date: new Date().toISOString(), walletId: 'w3', createdById: 'u1', description: 'บุฟเฟต์' },
        { id: 't8', amount: 1200, type: 'EXPENSE', category: 'Transport', date: new Date().toISOString(), walletId: 'w3', createdById: 'u1', description: 'น้ำมันรถ' }
    ]);

    debts = signal<Debt[]>([
        {
            id: 'd1', title: 'ยืมเพื่อน', type: 'BORROWED', totalAmount: 5000, remainingAmount: 2000, personName: 'น็อต',
            isInstallment: true, autoDeduct: false, walletId: 'w1', // Added missing props
            installmentPlan: { totalMonths: 5, paidMonths: 3, interestRate: 0, startDate: new Date().toISOString(), monthlyAmount: 1000 }
        },
        { id: 'd2', title: 'ค่าอาหาร', type: 'LENT', totalAmount: 500, remainingAmount: 500, personName: 'เจมส์', isInstallment: false, autoDeduct: false, walletId: 'w1' }
    ]);

    // Computed Values
    totalBalance = computed(() => this.wallets().reduce((sum, w) => sum + w.balance, 0));

    monthlyIncome = computed(() =>
        this.transactions()
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    monthlyExpense = computed(() =>
        this.transactions()
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0)
    );

    expenseByCategory = computed(() => {
        const expenses = this.transactions().filter(t => t.type === 'EXPENSE');
        const grouped = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1'];
        return Object.entries(grouped).map(([name, value], index) => ({
            name: this.translateCategory(name),
            value,
            color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value).slice(0, 5);
    });

    constructor() {
        // Load from local storage if exists
        const savedWallets = localStorage.getItem('wallets');
        if (savedWallets) this.wallets.set(JSON.parse(savedWallets));

        const savedTx = localStorage.getItem('transactions');
        if (savedTx) this.transactions.set(JSON.parse(savedTx));

        const savedDebts = localStorage.getItem('debts');
        if (savedDebts) this.debts.set(JSON.parse(savedDebts));

        // Persist effect
        effect(() => localStorage.setItem('wallets', JSON.stringify(this.wallets())));
        effect(() => localStorage.setItem('transactions', JSON.stringify(this.transactions())));
        effect(() => localStorage.setItem('debts', JSON.stringify(this.debts())));
    }

    // --- Actions ---

    addTransaction(tx: Omit<Transaction, 'id' | 'createdById'>) {
        const newTx: Transaction = { ...tx, id: crypto.randomUUID(), createdById: 'u1' };
        this.transactions.update(list => [newTx, ...list]);

        // Update Wallet Balance
        this.updateWalletBalance(tx.walletId, tx.amount, tx.type);
    }

    deleteTransaction(id: string) {
        const tx = this.transactions().find(t => t.id === id);
        if (!tx) return;

        this.transactions.update(list => list.filter(t => t.id !== id));

        const revertType = tx.type === 'INCOME' ? 'EXPENSE' : 'INCOME';
        this.updateWalletBalance(tx.walletId, tx.amount, revertType);
    }

    addWallet(wallet: Omit<Wallet, 'id'>) {
        const newWallet = { ...wallet, id: crypto.randomUUID() };
        this.wallets.update(list => [...list, newWallet]);
    }

    deleteWallet(id: string) {
        this.wallets.update(list => list.filter(w => w.id !== id));
    }

    updateWallet(id: string, data: Partial<Wallet>) {
        this.wallets.update(list => list.map(w => w.id === id ? { ...w, ...data } : w));
    }

    addDebt(debt: Omit<Debt, 'id'>) {
        const newDebt = { ...debt, id: crypto.randomUUID() };
        this.debts.update(list => [...list, newDebt]);
    }

    deleteDebt(id: string) {
        this.debts.update(list => list.filter(d => d.id !== id));
    }

    updateDebt(id: string, data: Partial<Debt>) {
        this.debts.update(list => list.map(d => d.id === id ? { ...d, ...data } : d));
    }

    payInstallment(debtId: string, amount: number, walletId: string) {
        const debt = this.debts().find(d => d.id === debtId);
        if (!debt) return;

        // 1. Create Transaction
        this.addTransaction({
            description: `ชำระหนี้: ${debt.title}`, // Changed from title to description
            amount: amount,
            type: 'EXPENSE',
            category: 'Utilities',
            date: new Date().toISOString(),
            walletId: walletId
        });

        // 2. Update Debt
        this.debts.update(list => list.map(d => {
            if (d.id !== debtId) return d;

            let newPaid = (d.installmentPlan?.paidMonths || 0);
            if (d.installmentPlan && amount >= d.installmentPlan.monthlyAmount) {
                newPaid += 1;
            }

            let newRemaining = d.remainingAmount - amount;
            if (newRemaining < 0) newRemaining = 0;

            return {
                ...d,
                remainingAmount: newRemaining,
                installmentPlan: d.installmentPlan ? {
                    ...d.installmentPlan,
                    paidMonths: newPaid
                } : undefined
            };
        }));
    }

    updateProfile(data: Partial<User>) {
        this.user.update(u => ({ ...u, ...data }));
    }

    private updateWalletBalance(walletId: string, amount: number, type: string) {
        this.wallets.update(list => list.map(w => {
            if (w.id !== walletId) return w;
            let newBalance = w.balance;
            if (type === 'INCOME') newBalance += amount;
            if (type === 'EXPENSE') newBalance -= amount;
            return { ...w, balance: newBalance };
        }));
    }

    private translateCategory(cat: string): string {
        const map: Record<string, string> = { 'Food': 'อาหาร', 'Transport': 'เดินทาง', 'Shopping': 'ช้อปปิ้ง', 'Entertainment': 'บันเทิง', 'Utilities': 'สาธารณูปโภค', 'Other': 'อื่นๆ', 'Salary': 'เงินเดือน', 'Freight': 'จ็อบพิเศษ' };
        return map[cat] || cat;
    }
}
