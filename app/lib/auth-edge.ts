import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key'
);

export interface SessionPayload {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'partner';
  adminRole?: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';
  expiresAt: Date;
}

// JWT トークンの検証（Edge Runtime対応）
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// JWT トークンの作成（Edge Runtime対応）
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

  const token = await new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}