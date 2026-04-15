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
VITE_ENABLE_TEMP_TEST_PANEL=false
VITE_USE_MOCK=false
```

Use `VITE_USE_MOCK=true` for deterministic local UI and Playwright runs.
Use `VITE_ENABLE_TEMP_TEST_PANEL=true` only when you want to expose the internal QA examples panel.
Set `VITE_GRAPHQL_ENDPOINT` and `VITE_RPC_ENDPOINT` locally before using live data.
Token symbol and decimals are read from chain RPC properties.
