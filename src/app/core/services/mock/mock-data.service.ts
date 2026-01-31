import { Injectable, signal, computed } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../models/user.interface';
import { Transaction } from '../../models/transaction.interface';
import { Wallet } from '../../models/wallet.interface';
import { Category } from '../../models/category.interface';
import { Debt } from '../../models/debt.interface';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {

    // User
    readonly currentUser = signal<User>({
        id: '1',
        username: 'demo_user',
        name: 'Demo User',
        email: 'demo@raijai.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    });

    // Users List (Mock Database)
    readonly users = signal<User[]>([
        {
            id: '1',
            username: 'demo_user',
            name: 'Demo User',
            email: 'demo@raijai.com',
            firstName: 'Demo',
            lastName: 'User',
            role: 'ADMIN',
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: '2',
            username: 'john_doe',
            name: 'John Doe',
            email: 'john@raijai.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER',
            status: 'ACTIVE',
            createdAt: '2024-01-15T10:30:00.000Z'
        },
        {
            id: '3',
            username: 'jane_smith',
            name: 'Jane Smith',
            email: 'jane@raijai.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'USER',
            status: 'INACTIVE',
            createdAt: '2024-01-20T14:15:00.000Z'
        }
    ]);


    // Categories
    readonly categories = signal<Category[]>([
        { id: '1', name: 'Food', type: 'EXPENSE', color: '#FF5733', icon: 'restaurant', createdAt: new Date().toISOString() },
        { id: '2', name: 'Transportation', type: 'EXPENSE', color: '#33FF57', icon: 'directions_car', createdAt: new Date().toISOString() },
        { id: '3', name: 'Entertainment', type: 'EXPENSE', color: '#3357FF', icon: 'movie', createdAt: new Date().toISOString() },
        { id: '4', name: 'Salary', type: 'INCOME', color: '#F1C40F', icon: 'attach_money', createdAt: new Date().toISOString() },
        { id: '5', name: 'Side Hustle', type: 'INCOME', color: '#9B59B6', icon: 'work', createdAt: new Date().toISOString() },
    ]);

    // Wallets
    readonly wallets = signal<Wallet[]>([
        { id: '1', name: 'Main Wallet', type: 'CASH', balance: 5000, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
        { id: '2', name: 'Bank Account', type: 'BANK', balance: 10420.50, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
        { id: '3', name: 'Credit Card', type: 'CREDIT_CARD', balance: -2500, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
    ]);

    // Transactions
    readonly transactions = signal<Transaction[]>([
        {
            id: '1', date: '2024-01-15', amount: 1500, type: 'EXPENSE', categoryId: '1', walletId: '1', createdById: '1', createdAt: new Date().toISOString(),
            category: { id: '1', name: 'Food', type: 'EXPENSE', color: '#FF5733', icon: 'restaurant', createdAt: new Date().toISOString() },
            wallet: { id: '1', name: 'Main Wallet', type: 'CASH', balance: 5000, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
            description: 'Grocery Store'
        },
        {
            id: '2', date: '2024-01-14', amount: 25000, type: 'INCOME', categoryId: '4', walletId: '2', createdById: '1', createdAt: new Date().toISOString(),
            category: { id: '4', name: 'Salary', type: 'INCOME', color: '#F1C40F', icon: 'attach_money', createdAt: new Date().toISOString() },
            wallet: { id: '2', name: 'Bank Account', type: 'BANK', balance: 10420.50, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
            description: 'Monthly Salary'
        },
        {
            id: '3', date: '2024-01-13', amount: 419, type: 'EXPENSE', categoryId: '3', walletId: '3', createdById: '1', createdAt: new Date().toISOString(),
            category: { id: '3', name: 'Entertainment', type: 'EXPENSE', color: '#3357FF', icon: 'movie', createdAt: new Date().toISOString() },
            wallet: { id: '3', name: 'Credit Card', type: 'CREDIT_CARD', balance: -2500, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
            description: 'Netflix Subscription'
        },
        {
            id: '4', date: '2024-01-12', amount: 800, type: 'EXPENSE', categoryId: '2', walletId: '1', createdById: '1', createdAt: new Date().toISOString(),
            category: { id: '2', name: 'Transportation', type: 'EXPENSE', color: '#33FF57', icon: 'directions_car', createdAt: new Date().toISOString() },
            wallet: { id: '1', name: 'Main Wallet', type: 'CASH', balance: 5000, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
            description: 'Gas Station'
        },
        {
            id: '5', date: '2024-01-11', amount: 150, type: 'EXPENSE', categoryId: '1', walletId: '1', createdById: '1', createdAt: new Date().toISOString(),
            category: { id: '1', name: 'Food', type: 'EXPENSE', color: '#FF5733', icon: 'restaurant', createdAt: new Date().toISOString() },
            wallet: { id: '1', name: 'Main Wallet', type: 'CASH', balance: 5000, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() },
            description: 'Lunch with Receipt',
            imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        }
    ]);

    // Debts
    readonly debts = signal<Debt[]>([
        {
            id: '1', title: 'Friend Loan', type: 'LENT', totalAmount: 500, remainingAmount: 500, personName: 'John Doe',
            isInstallment: false, autoDeduct: false, walletId: '1', createdAt: new Date().toISOString(),
            wallet: { id: '1', name: 'Main Wallet', type: 'CASH', balance: 5000, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() }
        },
        {
            id: '2', title: 'Credit Card Bill', type: 'BORROWED', totalAmount: 2500, remainingAmount: 2500, personName: 'Bank',
            isInstallment: false, autoDeduct: true, walletId: '2', createdAt: new Date().toISOString(), dueDate: '2024-01-25',
            wallet: { id: '2', name: 'Bank Account', type: 'BANK', balance: 10420.50, currency: 'THB', ownerId: '1', createdAt: new Date().toISOString() }
        },
    ]);

    // Dashboard Stats (Derived)
    readonly dashboardStats = computed(() => {
        return {
            totalBalance: this.wallets().reduce((acc, curr) => acc + curr.balance, 0),
            monthlyIncome: this.transactions().filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0),
            monthlyExpense: this.transactions().filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0),
            savings: 5000.00, // Hardcoded for now
            recentTransactions: this.transactions().slice(0, 5)
        };
    });


    getTransactions() {
        return of(this.transactions().filter(t => t.createdById === this.currentUser().id));
    }

    getWallets() {
        return of(this.wallets().filter(w => w.ownerId === this.currentUser().id));
    }

    getCategories() {
        return of(this.categories());
    }

    getDebts() {
        return of(this.debts().filter(d => d.ownerId === this.currentUser().id));
    }

    getUser() {
        return of(this.currentUser());
    }

    // User Management
    getUsers() {
        return of(this.users());
    }

    async addUser(user: Partial<User>) {
        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            username: user.username || user.email?.split('@')[0] || 'user',
            name: user.name || 'New User',
            email: user.email || '',
            role: user.role || 'USER',
            status: user.status || 'ACTIVE',
            createdAt: new Date().toISOString(),
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password // In a real app, hash this!
        };
        this.users.update(prev => [...prev, newUser]);
        return of(newUser);
    }

    async updateUser(id: string, updates: Partial<User>) {
        this.users.update(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        return of(true);
    }

    async deleteUser(id: string) {
        this.users.update(prev => prev.filter(u => u.id !== id));
        return of(true);
    }

    // Transactions
    deleteTransaction(id: string) {
        this.transactions.update(txs => txs.filter(t => t.id !== id));
    }

    async addTransaction(transaction: Partial<Transaction>) {
        const newTx: Transaction = {
            id: Math.random().toString(36).substring(7),
            date: transaction.date || new Date().toISOString(),
            amount: transaction.amount || 0,
            type: transaction.type || 'EXPENSE',
            categoryId: transaction.categoryId || '',
            walletId: transaction.walletId || '',
            toWalletId: transaction.toWalletId,
            description: transaction.description || '',
            imageUrl: transaction.imageUrl,
            createdById: this.currentUser().id,
            createdAt: new Date().toISOString(),
            // Populate mock relations
            category: this.categories().find(c => c.id === transaction.categoryId),
            wallet: this.wallets().find(w => w.id === transaction.walletId),
        };

        if (newTx.type === 'TRANSFER' && newTx.toWalletId) {
            newTx.toWallet = this.wallets().find(w => w.id === newTx.toWalletId);
        }

        this.transactions.update(txs => [newTx, ...txs]);
        return of(newTx);
    }

    // Wallets
    async addWallet(wallet: Partial<Wallet>) {
        const newWallet: Wallet = {
            id: Math.random().toString(36).substring(7),
            name: wallet.name || 'New Wallet',
            type: wallet.type || 'CASH',
            balance: wallet.balance || 0,
            currency: wallet.currency || 'THB',
            color: wallet.color || 'bg-zinc-500',
            ownerId: this.currentUser().id,
            createdAt: new Date().toISOString()
        };
        this.wallets.update(prev => [...prev, newWallet]);
        return of(newWallet);
    }

    async updateWallet(id: string, updates: Partial<Wallet>) {
        this.wallets.update(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
        return of(true);
    }

    async deleteWallet(id: string) {
        this.wallets.update(prev => prev.filter(w => w.id !== id));
        return of(true);
    }

    // Categories
    async addCategory(category: Partial<Category>) {
        const newCat: Category = {
            id: Math.random().toString(36).substring(7),
            name: category.name || 'New Category',
            type: category.type || 'EXPENSE',
            color: category.color || '#000000',
            icon: category.icon || 'category',
            createdAt: new Date().toISOString()
        };
        this.categories.update(prev => [...prev, newCat]);
        return of(newCat);
    }

    async updateCategory(id: string, updates: Partial<Category>) {
        this.categories.update(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        return of(true);
    }

    async deleteCategory(id: string) {
        this.categories.update(prev => prev.filter(c => c.id !== id));
        return of(true);
    }

    // Debts
    async addDebt(debt: Partial<Debt>) {
        const newDebt: Debt = {
            id: Math.random().toString(36).substring(7),
            title: debt.title || 'New Debt',
            type: debt.type || 'BORROWED',
            totalAmount: debt.totalAmount || 0,
            remainingAmount: debt.remainingAmount || 0,
            personName: debt.personName || 'Someone',
            isInstallment: debt.isInstallment || false,
            autoDeduct: debt.autoDeduct || false,
            walletId: debt.walletId || '',
            remark: debt.remark,
            installmentPlan: debt.installmentPlan,
            createdAt: new Date().toISOString(),
            ownerId: this.currentUser().id
        };
        this.debts.update(prev => [...prev, newDebt]);
        return of(newDebt);
    }

    async updateDebt(id: string, updates: Partial<Debt>) {
        this.debts.update(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
        return of(true);
    }

    async deleteDebt(id: string) {
        this.debts.update(prev => prev.filter(d => d.id !== id));
        return of(true);
    }

    async payInstallment(debtId: string, amount: number) {
        this.debts.update(prev => prev.map(d => {
            if (d.id === debtId) {
                const newRemaining = Math.max(0, d.remainingAmount - amount);
                let newPlan = d.installmentPlan;
                if (newPlan) {
                    newPlan = { ...newPlan, paidMonths: newPlan.paidMonths + 1 };
                }
                return { ...d, remainingAmount: newRemaining, installmentPlan: newPlan };
            }
            return d;
        }));
        return of(true);
    }
}
