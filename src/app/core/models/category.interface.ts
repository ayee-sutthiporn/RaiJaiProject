export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
    id: string;
    name: string;
    type: CategoryType;
    color: string;
    icon?: string;
    createdById?: string;
    createdAt: string;
}
