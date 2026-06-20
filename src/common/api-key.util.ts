import { createHash, randomBytes } from 'node:crypto';

export function generateApiKey() {
  const token = `lk_live_${randomBytes(24).toString('hex')}`;
  return {
    token,
    prefix: token.slice(0, 12),
    secretHash: sha256(token),
  };
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function maskApiKey(prefix: string) {
  return `${prefix}••••••••••`;
}
