import 'dotenv/config';

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '3001'), 10),
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
} as const;
