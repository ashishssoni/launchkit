import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('0.0.0.0'),
  APP_NAME: z.string().default('LaunchKit API'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/launchkit'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(10).default('change-me-access'),
  JWT_REFRESH_SECRET: z.string().min(10).default('change-me-refresh'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_xxx'),
  STRIPE_WEBHOOK_SECRET: z.string().default('whsec_xxx'),
  STRIPE_PRICE_PRO: z.string().default('price_pro_demo'),
  STRIPE_PRICE_TEAM: z.string().default('price_team_demo'),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
