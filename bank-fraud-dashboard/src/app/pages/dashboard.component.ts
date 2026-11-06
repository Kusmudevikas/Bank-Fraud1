import { Component, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <h1 style="margin-bottom:16px">Today at a glance</h1>
    <section class="grid kpis">
      <div class="card kpi"><small>Money moved</small><b>{{ data.volume() | currency:'INR':'symbol':'1.0-0' }}</b></div>
      <div class="card kpi"><small>Transactions</small><b>{{ data.txns().length }}</b></div>
      <div class="card kpi alert"><small>Waiting for review</small><b>{{ data.flagged().length }}</b></div>
      <div class="card kpi ok"><small>Fraud stopped</small><b>{{ data.protectedValue() | currency:'INR':'symbol':'1.0-0' }}</b></div>
    </section>

    <section class="grid two">
      <div class="card">
        <h2>Hourly volume</h2>
        <p class="legend"><i class="d a"></i>Normal <i class="d b"></i>Flagged or blocked</p>
        <svg viewBox="0 0 600 200" role="img" aria-label="Hourly transaction volume">
          @for (b of bars(); track b.hour) {
            <rect [attr.x]="b.x" [attr.y]="200 - 22 - b.h" width="34" [attr.height]="b.h" rx="3" fill="#0f766e" opacity=".85"/>
            <rect [attr.x]="b.x" [attr.y]="200 - 22 - b.rh" width="34" [attr.height]="b.rh" rx="3" fill="#b91c1c"/>
            <text [attr.x]="b.x + 17" y="195" text-anchor="middle" font-size="11" fill="#6b778c">{{ b.hour }}h</text>
          }
        </svg>
      </div>
      <div class="card">
        <h2>Risk mix</h2>
        <div class="donut" [style.background]="donut()"></div>
        <p class="legend"><i class="d a"></i>Low {{ mix().low }} <i class="d w"></i>Medium {{ mix().mid }} <i class="d b"></i>High {{ mix().high }}</p>
      </div>
    </section>

    <section class="card" style="margin-top:16px">
      <div class="head"><h2>Needs your review</h2><a routerLink="/alerts" class="btn">Open alerts</a></div>
      @if (data.flagged().length === 0) { <p class="empty">All clear. No transactions are waiting.</p> }
      <div class="wrap"><table>
        @for (t of data.flagged().slice(0, 5); track t.id) {
          <tr><td>{{ t.id }}</td><td>{{ t.customer }}</td><td>{{ t.channel }} · {{ t.country }}</td>
            <td>{{ t.amount | currency:'INR':'symbol':'1.0-0' }}</td><td>Risk {{ t.risk }}</td></tr>
        }
      </table></div>
    </section>
  `,
  styles: [`
    .head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
    svg{width:100%;height:auto}
    .legend{color:var(--muted);font-size:12px;margin:6px 0 10px}
    .d{display:inline-block;width:9px;height:9px;border-radius:50%;margin:0 4px 0 12px}.d:first-child{margin-left:0}
    .a{background:#0f766e}.b{background:#b91c1c}.w{background:#f59e0b}
    .donut{width:150px;height:150px;border-radius:50%;margin:14px auto;
      -webkit-mask:radial-gradient(circle 46px,transparent 98%,#000 100%);mask:radial-gradient(circle 46px,transparent 98%,#000 100%)}
  `]
})
export class DashboardComponent {
  constructor(public data: DataService) {}
  bars = computed(() => {
    const h = this.data.hourly();
    const max = Math.max(...h.map(x => x.total), 1);
    return h.map((x, i) => ({ hour: x.hour, x: 12 + i * 58, h: (x.total / max) * 150, rh: (x.risky / max) * 150 }));
  });
  mix = computed(() => {
    const t = this.data.txns();
    return { low: t.filter(x => x.risk < 40).length, mid: t.filter(x => x.risk >= 40 && x.risk < 70).length, high: t.filter(x => x.risk >= 70).length };
  });
  donut = computed(() => {
    const m = this.mix(), n = m.low + m.mid + m.high || 1;
    const a = (m.low / n) * 100, b = a + (m.mid / n) * 100;
    return `conic-gradient(#0f766e 0 ${a}%, #f59e0b ${a}% ${b}%, #b91c1c ${b}% 100%)`;
  });
}
