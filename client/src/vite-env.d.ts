/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT?: string
  readonly VITE_RPC_ENDPOINT?: string
  readonly VITE_ENABLE_TEMP_TEST_PANEL?: string
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
