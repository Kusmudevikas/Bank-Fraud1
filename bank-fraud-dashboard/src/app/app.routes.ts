import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { TransactionsComponent } from './pages/transactions.component';
import { AlertsComponent } from './pages/alerts.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, title: 'Overview' },
  { path: 'transactions', component: TransactionsComponent, title: 'Transactions' },
  { path: 'alerts', component: AlertsComponent, title: 'Fraud alerts' },
  { path: '**', redirectTo: 'dashboard' }
];
