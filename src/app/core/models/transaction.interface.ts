export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
    id: string;
    date: string; // ISO Date String
    amount: number;
    type: TransactionType;
    category: string;
    icon?: string; // Category icon
    description?: string;
    walletId: string;
    toWalletId?: string; // Required if type is TRANSFER
    tags?: string[];
    createdById: string;
}
