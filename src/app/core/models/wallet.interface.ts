import { HistoryLog } from './history-log.interface';

export type WalletType = 'CASH' | 'BANK' | 'CREDIT_CARD';

export interface Wallet {
    id: string;
    name: string;
    type: WalletType;
    balance: number;
    currency: string;
    icon?: string;
    color?: string; // Hex code or Tailwind class
    ownerId: string;
    sharedWithIds?: string[]; // For shared ledger
    history?: HistoryLog[];
}
