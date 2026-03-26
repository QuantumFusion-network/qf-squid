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
VITE_GRAPHQL_ENDPOINT=http://85.9.206.203:4350/graphql
VITE_RPC_ENDPOINT=wss://mainnet.qfnode.net
VITE_TOKEN_SYMBOL=QF
VITE_TOKEN_DECIMALS=18
VITE_USE_MOCK=false
```

Use `VITE_USE_MOCK=true` for deterministic local UI and Playwright runs.
