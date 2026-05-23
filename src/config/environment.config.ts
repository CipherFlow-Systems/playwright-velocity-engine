// Centralized environment configuration for CipherFlow Systems
// Purpose: provide per-environment runtime settings (baseUrl, timeouts, credentials placeholder)
// Architectural note: use a small, serializable config object so fixtures/tests can import safely.

export type EnvName = 'dev' | 'staging' | 'prod';

export interface EnvConfig {
  name: EnvName;
  baseUrl: string;
  timeoutMs: number;
  // Example placeholders for test credentials. In real enterprise usage these should come
  // from a secure secret store (Vault, KeyVault) and not be committed to source.
  ADMIN_USER?: string;
  ADMIN_PASS?: string;
}

const configs: Record<EnvName, EnvConfig> = {
  dev: {
    name: 'dev',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    timeoutMs: 30_000,
    ADMIN_USER: process.env.DEV_ADMIN_USER || 'dev-admin@example.com',
    ADMIN_PASS: process.env.DEV_ADMIN_PASS || 'dev-password',
  },
  staging: {
    name: 'staging',
    baseUrl: process.env.BASE_URL || 'https://staging.cipherflow.example',
    timeoutMs: 30_000,
    ADMIN_USER: process.env.STAGING_ADMIN_USER,
    ADMIN_PASS: process.env.STAGING_ADMIN_PASS,
  },
  prod: {
    name: 'prod',
    baseUrl: process.env.BASE_URL || 'https://app.cipherflow.example',
    timeoutMs: 60_000,
    // production creds should NEVER be supplied here; prefer env or secret manager integration
  },
};

// Helper to fetch config by environment name. Defaults to 'dev' for local runs.
export function getConfig(envName?: string): EnvConfig {
  const key = (envName || process.env.TEST_ENV || process.env.PLAYWRIGHT_TEST_ENV || 'dev') as EnvName;
  return configs[key] || configs.dev;
}

export default getConfig;
