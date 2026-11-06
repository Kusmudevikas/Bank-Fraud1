# Fraud Desk: Banking Operations & Fraud Monitoring Dashboard

Frontend-only Angular 18 app (standalone components, signals). It uses generated sample data in `src/app/data.service.ts`; replace that with your API calls later.

## Run
    npm install
    npm start        # http://localhost:4200

## Pages
- Overview: KPIs, hourly volume chart, risk mix, items to review
- Transactions: search and filter table with risk meters
- Fraud alerts: approve or block flagged transactions (updates every page)
