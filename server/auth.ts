import crypto from 'node:crypto';

const SESSION_COOKIE_NAME = 'kaamfix_admin_session';

function getSessionSecret(): string {
  return process.env.KAAMFIX_SESSION_SECRET || 'kaamfix-local-dev-secret-change-in-prod';
}

export function getConfiguredAdminPassword(): string {
  return process.env.KAAMFIX_ADMIN_PASSWORD || 'kaamfix-admin-2026';
}

export function verifyPassword(candidate: string): boolean {
  const expected = getConfiguredAdminPassword();
  const a = crypto.createHash('sha256').update(candidate).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 12; // 12 hours
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const eqIndex = part.indexOf('=');
    if (eqIndex > 0) {
      const key = part.slice(0, eqIndex).trim();
      const val = decodeURIComponent(part.slice(eqIndex + 1).trim());
      result[key] = val;
    }
  }
  return result;
}

export function isAdminRequestAuthenticated(cookieHeader: string | undefined): boolean {
  const cookies = parseCookieHeader(cookieHeader);
  return verifySessionToken(cookies[SESSION_COOKIE_NAME]);
}

export function buildSessionCookie(token: string, clear = false): string {
  if (clear) {
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  }
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200`;
}
