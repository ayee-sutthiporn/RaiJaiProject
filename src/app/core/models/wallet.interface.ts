import { User } from './user.interface';

export type WalletType = 'CASH' | 'BANK' | 'CREDIT_CARD';

export interface Wallet {
    id: string;
    name: string;
    type: WalletType;
    balance: number;
    currency: string;
    color?: string; // Hex code or Tailwind class
    ownerId: string;
    owner?: User; // Populated in responses
    createdAt: string;
    bookId?: string;
}
