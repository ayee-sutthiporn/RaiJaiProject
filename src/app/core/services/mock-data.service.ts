import { Injectable, computed, signal, effect } from '@angular/core';
import { User } from '../models/user.interface';
import { Transaction } from '../models/transaction.interface';
import { Wallet } from '../models/wallet.interface';
import { Debt } from '../models/debt.interface';
import { HistoryLog } from '../models/history-log.interface';

export interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    color: string;
    icon?: string;
}

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

    categories = signal<Category[]>([
        { id: 'c1', name: 'อาหาร', type: 'EXPENSE', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400', icon: '🍔' },
        { id: 'c2', name: 'เดินทาง', type: 'EXPENSE', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', icon: '🚕' },
        { id: 'c3', name: 'ช้อปปิ้ง', type: 'EXPENSE', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', icon: '🛍️' },
        { id: 'c4', name: 'บันเทิง', type: 'EXPENSE', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400', icon: '🎬' },
        { id: 'c5', name: 'บิล/สาธารณูปโภค', type: 'EXPENSE', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400', icon: '⚡' }, // Utilities map to this
        { id: 'c6', name: 'เงินเดือน', type: 'INCOME', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', icon: '💰' },
        { id: 'c7', name: 'ลงทุน', type: 'INCOME', color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400', icon: '📈' },
        { id: 'c8', name: 'จ็อบพิเศษ', type: 'INCOME', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400', icon: '💵' }, // Freight
        { id: 'c9', name: 'โอนเงิน', type: 'EXPENSE', color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400', icon: '💸' },
        { id: 'c10', name: 'ซ่อมบำรุง', type: 'EXPENSE', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', icon: '🔧' },
        { id: 'c11', name: 'อื่นๆ', type: 'EXPENSE', color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400', icon: '📝' }
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
        this.recordHistory(newWallet, 'CREATE', 'สร้างกระเป๋าเงินใหม่');
        this.wallets.update(list => [...list, newWallet]);
    }

    deleteWallet(id: string) {
        this.wallets.update(list => list.filter(w => w.id !== id));
    }

    updateWallet(id: string, data: Partial<Wallet>) {
        this.wallets.update(list => list.map(w => {
            if (w.id === id) {
                const updated = { ...w, ...data };
                const changes = this.generateDiff(w, updated);
                if (changes.length > 0) {
                    this.recordHistory(updated, 'UPDATE', 'แก้ไขข้อมูลกระเป๋าเงิน', w, changes);
                }
                return updated;
            }
            return w;
        }));
    }

    addDebt(debt: Omit<Debt, 'id'>) {
        const newDebt = { ...debt, id: crypto.randomUUID() };
        this.recordHistory(newDebt, 'CREATE', 'สร้างรายการหนี้สินใหม่');
        this.debts.update(list => [...list, newDebt]);
    }

    deleteDebt(id: string) {
        this.debts.update(list => list.filter(d => d.id !== id));
    }

    updateDebt(id: string, data: Partial<Debt>) {
        this.debts.update(list => list.map(d => {
            if (d.id === id) {
                const updated = { ...d, ...data };
                const changes = this.generateDiff(d, updated);
                if (changes.length > 0) {
                    this.recordHistory(updated, 'UPDATE', 'แก้ไขรายการหนี้สิน', d, changes);
                }
                return updated;
            }
            return d;
        }));
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

            const updatedDebt = {
                ...d,
                remainingAmount: newRemaining,
                installmentPlan: d.installmentPlan ? {
                    ...d.installmentPlan,
                    paidMonths: newPaid
                } : undefined
            };
            this.recordHistory(updatedDebt, 'PAYMENT', `ชำระยอด ${amount} บาท`, d);
            return updatedDebt;
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

    addCategory(category: Omit<Category, 'id'>) {
        const newCat: Category = { ...category, id: crypto.randomUUID() };
        this.categories.update(list => [...list, newCat]);
    }

    deleteCategory(id: string) {
        this.categories.update(list => list.filter(c => c.id !== id));
    }

    updateCategory(id: string, data: Partial<Category>) {
        this.categories.update(list => list.map(c => c.id === id ? { ...c, ...data } : c));
    }

    private translateCategory(cat: string): string {
        // Legacy translation for old mock data keys to new Display Names
        const map: Record<string, string> = {
            'Food': 'อาหาร',
            'Transport': 'เดินทาง',
            'Shopping': 'ช้อปปิ้ง',
            'Entertainment': 'บันเทิง',
            'Utilities': 'บิล/สาธารณูปโภค',
            'Other': 'อื่นๆ',
            'Salary': 'เงินเดือน',
            'Freight': 'จ็อบพิเศษ',
            'Maintenance': 'ซ่อมบำรุง'
        };
        return map[cat] || cat;
    }

    private recordHistory(entity: { history?: HistoryLog[] }, action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PAYMENT', details: string, previousValue?: unknown, changes?: string[]) {
        const log: HistoryLog = {
            id: crypto.randomUUID(),
            action,
            timestamp: new Date().toISOString(),
            details,
            previousValue: previousValue ? JSON.parse(JSON.stringify(previousValue)) : undefined,
            newValue: JSON.parse(JSON.stringify(entity)),
            changes
        };

        if (!entity.history) {
            entity.history = [];
        }
        entity.history.unshift(log);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private generateDiff(oldObj: any, newObj: any): string[] {
        const changes: string[] = [];
        const ignoreFields = ['id', 'history', 'ownerId', 'sharedWithIds', 'createdById'];

        // Helper to formatting values
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatVal = (val: any) => {
            if (typeof val === 'number') return val.toLocaleString();
            return val;
        }

        const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

        keys.forEach(key => {
            if (ignoreFields.includes(key)) return;

            const oldVal = oldObj[key];
            const newVal = newObj[key];

            // Deep compare for object (like installmentPlan)
            if (typeof oldVal === 'object' && oldVal !== null && typeof newVal === 'object' && newVal !== null) {
                if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                    // Check specific sub-fields if needed, or just say field changed
                    if (key === 'installmentPlan') {
                        if (oldVal.monthlyAmount !== newVal.monthlyAmount) changes.push(`ยอดผ่อนต่อเดือน: ${formatVal(oldVal.monthlyAmount)} -> ${formatVal(newVal.monthlyAmount)}`);
                        if (oldVal.interestRate !== newVal.interestRate) changes.push(`ดอกเบี้ย: ${oldVal.interestRate}% -> ${newVal.interestRate}%`);
                        if (oldVal.totalMonths !== newVal.totalMonths) changes.push(`จำนวนงวด: ${oldVal.totalMonths} -> ${newVal.totalMonths}`);
                    } else {
                        changes.push(`ปรับปรุงข้อมูล ${key}`);
                    }
                }
                return;
            }

            if (oldVal !== newVal) {
                // Translate keys for better readability if needed
                let label = key;
                if (key === 'name' || key === 'title') label = 'ชื่อ';
                if (key === 'balance' || key === 'totalAmount') label = 'ยอดเงิน';
                if (key === 'type') label = 'ประเภท';
                if (key === 'personName') label = 'คู่สัญญา';
                if (key === 'remainingAmount') label = 'ยอดคงเหลือ';

                changes.push(`${label}: ${formatVal(oldVal)} -> ${formatVal(newVal)}`);
            }
        });

        return changes;
    }
}
