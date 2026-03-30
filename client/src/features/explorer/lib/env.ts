export const appEnv = {
  appVersion: __APP_VERSION__,
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || "",
  rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || "",
  useMock: import.meta.env.VITE_USE_MOCK === "true",
} as const
