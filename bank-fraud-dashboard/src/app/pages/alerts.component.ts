import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <h1 style="margin-bottom:4px">Fraud alerts</h1>
    <p style="color:var(--muted);margin:0 0 16px">Review each flagged transaction, then approve or block it.</p>
    @if (data.flagged().length === 0) { <div class="card empty">Nothing to review. New alerts will appear here.</div> }
    <div class="grid list">
      @for (t of data.flagged(); track t.id) {
        <article class="card">
          <header><h2>{{ t.customer }}</h2><span class="score">Risk {{ t.risk }}</span></header>
          <p class="amt">{{ t.amount | currency:'INR':'symbol':'1.0-0' }}</p>
          <p class="meta">{{ t.id }} · {{ t.channel }} from {{ t.country }} at {{ t.time }}</p>
          <div class="actions">
            <button class="btn primary" (click)="data.resolve(t.id, 'Approved')">Approve</button>
            <button class="btn danger" (click)="data.resolve(t.id, 'Blocked')">Block</button>
          </div>
        </article>
      }
    </div>
  `,
  styles: [`
    .list{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
    header{display:flex;justify-content:space-between;align-items:center}
    .score{background:var(--warnbg);color:var(--warn);border-radius:99px;padding:3px 10px;font-size:12px;font-weight:600}
    .amt{font-size:24px;font-weight:600;margin:12px 0 2px}
    .meta{color:var(--muted);margin:0 0 14px}
    .actions{display:flex;gap:8px}
  `]
})
export class AlertsComponent {
  constructor(public data: DataService) {}
}
