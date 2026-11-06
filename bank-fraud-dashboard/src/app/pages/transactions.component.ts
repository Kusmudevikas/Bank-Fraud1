import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <h1 style="margin-bottom:16px">Transactions</h1>
    <div class="toolbar">
      <input placeholder="Search by ID or customer" aria-label="Search" (input)="q.set($any($event.target).value)">
      <select aria-label="Filter by status" (change)="status.set($any($event.target).value)">
        <option value="">All statuses</option><option>Approved</option><option>Flagged</option><option>Blocked</option>
      </select>
    </div>
    <div class="card wrap">
      <table>
        <thead><tr><th>ID</th><th>Time</th><th>Customer</th><th>Channel</th><th>Amount</th><th>Risk</th><th>Status</th></tr></thead>
        <tbody>
          @for (t of rows(); track t.id) {
            <tr><td>{{ t.id }}</td><td>{{ t.time }}</td><td>{{ t.customer }}</td><td>{{ t.channel }} · {{ t.country }}</td>
              <td>{{ t.amount | currency:'INR':'symbol':'1.0-0' }}</td>
              <td><span class="meter"><i [style.width.%]="t.risk" [style.background]="t.risk>=85?'#b91c1c':t.risk>=60?'#f59e0b':'#0f766e'"></i></span>{{ t.risk }}</td>
              <td><span class="badge" [class]="'badge ' + t.status">{{ t.status }}</span></td></tr>
          }
        </tbody>
      </table>
      @if (rows().length === 0) { <p class="empty">No transactions match. Try a different search or status.</p> }
    </div>
  `
})
export class TransactionsComponent {
  q = signal(''); status = signal('');
  constructor(private data: DataService) {}
  rows = computed(() => {
    const q = this.q().toLowerCase();
    return this.data.txns().filter(t =>
      (!this.status() || t.status === this.status()) &&
      (!q || t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q)));
  });
}
