import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <aside>
      <div class="brand">Fraud Desk</div>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="on">Overview</a>
        <a routerLink="/transactions" routerLinkActive="on">Transactions</a>
        <a routerLink="/alerts" routerLinkActive="on">Fraud alerts
          @if (data.flagged().length) { <span class="pill">{{ data.flagged().length }}</span> }
        </a>
      </nav>
      <p class="foot">Operations team<br>Shift: day</p>
    </aside>
    <main><router-outlet /></main>
  `,
  styles: [`
    :host{display:grid;grid-template-columns:220px 1fr;min-height:100vh}
    aside{background:var(--ink);color:#c9d3e6;padding:22px 14px;display:flex;flex-direction:column}
    .brand{color:#fff;font-size:18px;font-weight:600;padding:0 10px 22px}
    nav{display:flex;flex-direction:column;gap:4px}
    a{color:inherit;text-decoration:none;padding:10px;border-radius:8px;display:flex;justify-content:space-between}
    a:hover{background:var(--ink2)}
    a.on{background:var(--teal);color:#fff}
    .pill{background:#f59e0b;color:#1b1300;border-radius:99px;padding:0 8px;font-size:12px;font-weight:600}
    .foot{margin-top:auto;padding:0 10px;font-size:12px;color:#8a98b5}
    main{padding:26px;min-width:0}
    @media(max-width:700px){:host{grid-template-columns:1fr}aside{flex-direction:row;align-items:center;padding:10px}
      .brand{padding:0 10px}.foot{display:none}nav{flex-direction:row}}
  `]
})
export class AppComponent {
  constructor(public data: DataService) {}
}
