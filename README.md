# Sevai Web Dashboard

Stateless financial wellness dashboard built with React, Vite, Recharts, and
Motion. The production build is a static SPA; dashboard data is fetched in the
browser directly from n8n.

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `VITE_N8N_WEBHOOK_URL` in `.env.local`, then open:

```text
http://localhost:3000/?sheetId=YOUR_GOOGLE_SHEET_ID
```

The browser requests:

```text
${VITE_N8N_WEBHOOK_URL}/webhook/dashboard-data?sheetId=YOUR_GOOGLE_SHEET_ID
```

The n8n webhook must return the dashboard JSON and allow browser requests with
the appropriate CORS headers, including `Access-Control-Allow-Origin`.

## Static build

```bash
npm run build
```

The static build is written to `dist/` and does not require a Node.js server.
The app requires a `sheetId` query parameter and displays loading and error
states while the webhook request is in progress. Dashboard sections with
missing or empty data are hidden.

## GitHub Pages

Pushes to `main` run `.github/workflows/deploy-pages.yml`. Before the first
deployment:

1. Add the repository variable `VITE_N8N_WEBHOOK_URL`.
2. Set GitHub Pages' source to **GitHub Actions**.

The workflow configures the repository path as the Vite base path and deploys
the generated `dist/` directory.
