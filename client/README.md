# QF Network Explorer Client

Frontend MVP for transfer-focused explorer UI inside the `qf-squid` repository.

## Scripts

```bash
npm install
npm run dev
npm run build
npm test
npm run test:e2e
```

## Environment

Copy `.env.example` and override values if needed:

```bash
VITE_GRAPHQL_ENDPOINT=
VITE_RPC_ENDPOINT=
VITE_TOKEN_SYMBOL=QF
VITE_TOKEN_DECIMALS=18
VITE_USE_MOCK=false
```

Use `VITE_USE_MOCK=true` for deterministic local UI and Playwright runs.
Set `VITE_GRAPHQL_ENDPOINT` and `VITE_RPC_ENDPOINT` locally before using live data.
