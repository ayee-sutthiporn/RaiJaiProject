import { HistoryLog } from './history-log.interface';

export type DebtType = 'LENT' | 'BORROWED';

export interface InstallmentPlan {
    totalMonths: number;
    paidMonths: number;
    interestRate: number; // Percentage
    startDate: string;
    monthlyAmount: number;
}

export interface Debt {
    id: string;
    title: string;
    type: DebtType;
    totalAmount: number;
    remainingAmount: number;
    dueDate?: string; // Next due date
    personName: string; // The counterparty
    isInstallment: boolean;
    installmentPlan?: InstallmentPlan;
    autoDeduct: boolean; // Simulation toggle
    walletId: string; // Related wallet for deduction/receiving
    history?: HistoryLog[];
}
