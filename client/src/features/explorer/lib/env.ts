export const appEnv = {
  appVersion: __APP_VERSION__,
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://85.9.206.203:4350/graphql",
  rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || "wss://mainnet.qfnode.net",
  tokenSymbol: import.meta.env.VITE_TOKEN_SYMBOL || "QF",
  tokenDecimals: Number(import.meta.env.VITE_TOKEN_DECIMALS || "18"),
  useMock: import.meta.env.VITE_USE_MOCK === "true",
} as const
