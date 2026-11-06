import { Injectable, computed, signal } from '@angular/core';

export type Status = 'Approved' | 'Flagged' | 'Blocked';
export interface Txn {
  id: string; customer: string; channel: string; amount: number;
  country: string; risk: number; status: Status; hour: number; time: string;
}

const NAMES = ['Aarav Mehta', 'Priya Nair', 'John Carter', 'Sofia Rossi', 'Liam Chen', 'Fatima Khan', 'Noah Smith', 'Isha Patil', 'Omar Haddad', 'Emma Brown'];
const CHANNELS = ['UPI', 'Card', 'NetBanking', 'ATM', 'Wire'];
const COUNTRIES = ['IN', 'IN', 'IN', 'US', 'GB', 'AE', 'SG', 'NG', 'RU'];

function generate(): Txn[] {
  let s = 11;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 36 }, (_, i) => {
    const risk = Math.round(r() * r() * 100 + r() * 20);
    const hour = 8 + Math.floor(i / 3);
    const status: Status = risk >= 85 ? 'Blocked' : risk >= 60 ? 'Flagged' : 'Approved';
    return {
      id: 'TX' + (48200 + i), customer: NAMES[Math.floor(r() * NAMES.length)],
      channel: CHANNELS[Math.floor(r() * CHANNELS.length)],
      amount: Math.round(r() * r() * 200000) + 500,
      country: COUNTRIES[Math.floor(r() * COUNTRIES.length)],
      risk: Math.min(risk, 99), status, hour,
      time: `${String(hour).padStart(2, '0')}:${String(Math.floor(r() * 60)).padStart(2, '0')}`
    };
  }).reverse();
}

@Injectable({ providedIn: 'root' })
export class DataService {
  txns = signal<Txn[]>(generate());
  flagged = computed(() => this.txns().filter(t => t.status === 'Flagged'));
  volume = computed(() => this.txns().reduce((a, t) => a + t.amount, 0));
  blocked = computed(() => this.txns().filter(t => t.status === 'Blocked'));
  protectedValue = computed(() => this.blocked().reduce((a, t) => a + t.amount, 0));
  hourly = computed(() => {
    const m = new Map<number, { total: number; risky: number }>();
    for (const t of this.txns()) {
      const h = m.get(t.hour) ?? { total: 0, risky: 0 };
      h.total += t.amount; if (t.status !== 'Approved') h.risky += t.amount;
      m.set(t.hour, h);
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([hour, v]) => ({ hour, ...v }));
  });

  resolve(id: string, status: Status) {
    this.txns.update(list => list.map(t => (t.id === id ? { ...t, status } : t)));
  }
}
