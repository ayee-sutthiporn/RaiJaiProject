import { Category } from './category.interface';
import { User } from './user.interface';
import { Wallet } from './wallet.interface';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
    id: string;
    date: string; // ISO Date String
    amount: number;
    type: TransactionType;
    categoryId: string;
    category?: Category; // Populated in responses
    description?: string;
    walletId: string;
    wallet?: Wallet; // Populated in responses
    toWalletId?: string; // Required if type is TRANSFER
    toWallet?: Wallet; // Populated in responses
    createdById: string;
    createdBy?: User; // Populated in responses
    createdAt: string;
}
