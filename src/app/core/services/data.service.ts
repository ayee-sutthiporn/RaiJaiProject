import { Injectable, inject, signal, computed } from '@angular/core';

import { CategoryApiService } from './api/category-api.service';
import { WalletApiService } from './api/wallet-api.service';
import { TransactionApiService } from './api/transaction-api.service';
import { DebtApiService } from './api/debt-api.service';
import { BookApiService, Book } from './api/book-api.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.interface';
import { Transaction } from '../models/transaction.interface';
import { Wallet } from '../models/wallet.interface';
import { Debt } from '../models/debt.interface';
import { Category } from '../models/category.interface';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private categoryApi = inject(CategoryApiService);
    private walletApi = inject(WalletApiService);
    private transactionApi = inject(TransactionApiService);
    private debtApi = inject(DebtApiService);
    private bookApi = inject(BookApiService);
    private authService = inject(AuthService);

    // Signals for State
    user = signal<User | null>(null);
    wallets = signal<Wallet[]>([]);
    transactions = signal<Transaction[]>([]);
    categories = signal<Category[]>([]);
    debts = signal<Debt[]>([]);

    // Book State
    books = signal<Book[]>([]);
    currentBook = signal<Book | null>(null);

    // Loading states
    loading = signal(false);

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
            const categoryName = t.category?.name || 'อื่นๆ';
            acc[categoryName] = (acc[categoryName] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);

        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1'];
        return Object.entries(grouped).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        })).sort((a, b) => b.value - a.value).slice(0, 5);
    });

    // ===== Data Loading =====
    async loadAllData() {
        this.loading.set(true);
        try {
            await Promise.all([
                this.loadUser(),
                this.loadBooks()
            ]);

            // If no book selected, select first one
            if (this.books().length > 0 && !this.currentBook()) {
                this.currentBook.set(this.books()[0]);
            } else if (this.books().length === 0) {
                // Create default personal book if none exists?
                // For now just handle empty
            }

            // Load data for current book
            if (this.currentBook()) {
                await Promise.all([
                    this.loadCategories(),
                    this.loadWallets(),
                    this.loadTransactions(),
                    this.loadDebts()
                ]);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            this.loading.set(false);
        }
    }

    async loadUser() {
        // Sync user from AuthService
        const user = this.authService.user();
        if (user) {
            this.user.set(user);
        } else {
            console.warn('[DataService] No user found in AuthService');
        }
    }

    async loadCategories() {
        try {
            const bookId = this.currentBook()?.id;
            const categories = await this.categoryApi.getCategories(undefined, bookId).toPromise();
            this.categories.set(categories || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadWallets() {
        try {
            const userId = this.user()?.id;
            const bookId = this.currentBook()?.id;
            const wallets = await this.walletApi.getWallets(userId, bookId).toPromise();
            this.wallets.set(wallets || []);
        } catch (error) {
            console.error('Error loading wallets:', error);
        }
    }

    async loadTransactions() {
        try {
            const bookId = this.currentBook()?.id;
            const transactions = await this.transactionApi.getTransactions(undefined, bookId).toPromise();
            this.transactions.set(transactions || []);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    async loadDebts() {
        try {
            const bookId = this.currentBook()?.id;
            const debts = await this.debtApi.getDebts(undefined, bookId).toPromise();
            this.debts.set(debts || []);
        } catch (error) {
            console.error('Error loading debts:', error);
        }
    }

    // ===== Book Actions =====
    async loadBooks() {
        try {
            const books = await this.bookApi.getBooks().toPromise();
            this.books.set(books || []);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    async createBook(name: string, description?: string) {
        try {
            const book = await this.bookApi.createBook({ name, description }).toPromise();
            if (book) {
                this.books.update(list => [...list, book]);
                // If this is the first book, select it
                if (!this.currentBook()) {
                    this.switchBook(book);
                }
            }
            return book;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }

    async switchBook(book: Book) {
        this.loading.set(true);
        // Clear all data immediately to prevent "leaking" previous book data to UI
        this.transactions.set([]);
        this.wallets.set([]);
        this.categories.set([]);
        this.debts.set([]);

        this.currentBook.set(book);

        try {
            await Promise.all([
                this.loadCategories(),
                this.loadWallets(),
                this.loadTransactions(),
                this.loadDebts()
            ]);
        } finally {
            this.loading.set(false);
        }
    }

    async deleteBook(id: string) {
        try {
            await this.bookApi.deleteBook(id).toPromise();
            this.books.update(list => list.filter(b => b.id !== id));

            // If deleted book was current, switch to first available or null
            if (this.currentBook()?.id === id) {
                const remaining = this.books();
                if (remaining.length > 0) {
                    await this.switchBook(remaining[0]);
                } else {
                    this.currentBook.set(null);
                    // Clear data
                    this.transactions.set([]);
                    this.wallets.set([]);
                    this.categories.set([]);
                    this.debts.set([]);
                }
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }

    // ===== Category Actions =====
    async addCategory(category: Partial<Category>) {
        try {

            if (this.currentBook()?.id) {
                category.bookId = this.currentBook()?.id;
            }
            const newCategory = await this.categoryApi.createCategory(category).toPromise();
            if (newCategory) {
                this.categories.update(list => [...list, newCategory]);
            }
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async updateCategory(id: string, data: Partial<Category>) {
        try {
            const updated = await this.categoryApi.updateCategory(id, data).toPromise();
            if (updated) {
                this.categories.update(list => list.map(c => c.id === id ? updated : c));
            }
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    async deleteCategory(id: string) {
        try {
            await this.categoryApi.deleteCategory(id).toPromise();
            this.categories.update(list => list.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    // ===== Wallet Actions =====
    async addWallet(wallet: Partial<Wallet>) {
        try {
            // Inject Owner ID if missing
            if (!wallet.ownerId) {
                wallet.ownerId = this.user()?.id;
            }
            if (this.currentBook()?.id) {
                wallet.bookId = this.currentBook()?.id;
            }
            const newWallet = await this.walletApi.createWallet(wallet).toPromise();
            if (newWallet) {
                this.wallets.update(list => [...list, newWallet]);
            }
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }

    async updateWallet(id: string, data: Partial<Wallet>) {
        try {
            const updated = await this.walletApi.updateWallet(id, data).toPromise();
            if (updated) {
                this.wallets.update(list => list.map(w => w.id === id ? updated : w));
            }
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    }

    async deleteWallet(id: string) {
        try {
            await this.walletApi.deleteWallet(id).toPromise();
            this.wallets.update(list => list.filter(w => w.id !== id));
        } catch (error) {
            console.error('Error deleting wallet:', error);
            throw error;
        }
    }

    // ===== Transaction Actions =====
    async addTransaction(transaction: Partial<Transaction>) {
        try {
            // Inject CreatedBy ID if missing
            if (!transaction.createdById) {
                transaction.createdById = this.user()?.id;
            }
            if (this.currentBook()?.id) {
                transaction.bookId = this.currentBook()?.id;
            }
            const newTx = await this.transactionApi.createTransaction(transaction).toPromise();
            if (newTx) {
                this.transactions.update(list => [newTx, ...list]);
                // Reload wallets to update balances
                await this.loadWallets();
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    async updateTransaction(id: string, data: Partial<Transaction>) {
        try {
            const updated = await this.transactionApi.updateTransaction(id, data).toPromise();
            if (updated) {
                this.transactions.update(list => list.map(t => t.id === id ? updated : t));
                // Reload wallets to update balances
                await this.loadWallets();
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async deleteTransaction(id: string) {
        try {
            await this.transactionApi.deleteTransaction(id).toPromise();
            this.transactions.update(list => list.filter(t => t.id !== id));
            // Reload wallets to update balances
            await this.loadWallets();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }

    // ===== Debt Actions =====
    async addDebt(debt: Partial<Debt>) {
        try {

            if (this.currentBook()?.id) {
                debt.bookId = this.currentBook()?.id;
            }
            const newDebt = await this.debtApi.createDebt(debt).toPromise();
            if (newDebt) {
                this.debts.update(list => [...list, newDebt]);
            }
        } catch (error) {
            console.error('Error creating debt:', error);
            throw error;
        }
    }

    async updateDebt(id: string, data: Partial<Debt>) {
        try {
            const updated = await this.debtApi.updateDebt(id, data).toPromise();
            if (updated) {
                this.debts.update(list => list.map(d => d.id === id ? updated : d));
            }
        } catch (error) {
            console.error('Error updating debt:', error);
            throw error;
        }
    }

    async deleteDebt(id: string) {
        try {
            await this.debtApi.deleteDebt(id).toPromise();
            this.debts.update(list => list.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting debt:', error);
            throw error;
        }
    }

    async payInstallment(debtId: string, amount: number) {
        try {
            const updated = await this.debtApi.payDebt(debtId, amount).toPromise();
            if (updated) {
                this.debts.update(list => list.map(d => d.id === debtId ? updated : d));
                // Reload wallets and transactions to reflect the payment
                await this.loadWallets();
                await this.loadTransactions();
            }
        } catch (error) {
            console.error('Error paying debt:', error);
            throw error;
        }
    }
}
