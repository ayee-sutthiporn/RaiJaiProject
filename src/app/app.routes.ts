import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'transactions',
                loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsPageComponent)
            },
            {
                path: 'wallets',
                loadComponent: () => import('./features/wallets/wallets.component').then(m => m.WalletsComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
            },
            {
                path: 'debts',
                loadComponent: () => import('./features/debts/debts.component').then(m => m.DebtsComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
            }
        ]
    }
];
