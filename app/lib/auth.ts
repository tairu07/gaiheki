import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key'
);

// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface SessionPayload {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'partner';
  adminRole?: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATOR';
  expiresAt: Date;
}

// JWT トークンの作成
export async function createToken(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

  const token = await new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return { token, expiresAt };
}

// JWT トークンの検証
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// セッションの取得（管理者用）
export async function getAdminSession(request?: NextRequest): Promise<SessionPayload | null> {
  try {
    const cookieStore = request ? request.cookies : await cookies();
    const token = cookieStore.get('admin-token');

    if (!token) {
      // 開発環境では、モックセッションを返す
      if (process.env.NODE_ENV === 'development') {
        return {
          userId: 1,
          username: 'admin',
          email: 'admin@gaiheki.com',
          role: 'admin',
          adminRole: 'SUPER_ADMIN',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        };
      }
      return null;
    }

    const session = await verifyToken(token.value);

    if (!session || session.role !== 'admin') {
      return null;
    }

    // セッションの有効性を確認
    const adminSession = await prisma.adminSession.findFirst({
      where: {
        adminId: session.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!adminSession) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Database connection error in getAdminSession:', error);
    // データベース接続エラーの場合、開発環境ではモックセッションを返す
    if (process.env.NODE_ENV === 'development') {
      return {
        userId: 1,
        username: 'admin',
        email: 'admin@gaiheki.com',
        role: 'admin',
        adminRole: 'SUPER_ADMIN',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
    }
    return null;
  }
}

// セッションの取得（加盟店用）
export async function getPartnerSession(request?: NextRequest): Promise<SessionPayload | null> {
  const cookieStore = request ? request.cookies : await cookies();
  const token = cookieStore.get('partner-token');

  if (!token) {
    return null;
  }

  const session = await verifyToken(token.value);

  if (!session || session.role !== 'partner') {
    return null;
  }

  return session;
}

// 管理者ログイン
export async function loginAdmin(username: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !admin.isActive) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    // 既存のセッションを削除
    await prisma.adminSession.deleteMany({
      where: { adminId: admin.id },
    });

    // 新しいセッションを作成
    const { token } = await createToken({
      userId: admin.id,
      username: admin.username,
      email: admin.email,
      role: 'admin',
      adminRole: admin.role,
    });

    // データベースにセッションを保存
    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        expiresAt,
      },
    });

    // 最終ログイン時刻を更新
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return { success: true, token, admin };
  } catch (error) {
    console.error('Database error in loginAdmin:', error);

    // 開発環境でデータベースエラーの場合、デフォルト認証を許可
    if (process.env.NODE_ENV === 'development' &&
        username === 'admin' &&
        password === 'admin123') {

      const { token } = await createToken({
        userId: 1,
        username: 'admin',
        email: 'admin@gaiheki.com',
        role: 'admin',
        adminRole: 'SUPER_ADMIN',
      });

      return {
        success: true,
        token,
        admin: {
          id: 1,
          username: 'admin',
          email: 'admin@gaiheki.com',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      };
    }

    return { success: false, error: 'Database connection error' };
  }
}

// 加盟店ログイン
export async function loginPartner(email: string, password: string) {
  const partner = await prisma.partners.findUnique({
    where: { login_email: email },
  });

  if (!partner || !partner.is_active) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValidPassword = await bcrypt.compare(password, partner.password_hash);

  if (!isValidPassword) {
    return { success: false, error: 'Invalid credentials' };
  }

  const { token } = await createToken({
    userId: partner.id,
    username: partner.username,
    email: partner.login_email,
    role: 'partner',
  });

  // 最終ログイン時刻を更新
  await prisma.partners.update({
    where: { id: partner.id },
    data: { last_login_at: new Date() },
  });

  return { success: true, token, partner };
}

// ログアウト（管理者）
export async function logoutAdmin(userId: number) {
  await prisma.adminSession.deleteMany({
    where: { adminId: userId },
  });
}

// セッションクリーンアップ（定期実行用）
export async function cleanupExpiredSessions() {
  const deletedSessions = await prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return deletedSessions.count;
}