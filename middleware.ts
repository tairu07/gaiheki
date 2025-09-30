import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth-edge';

// 保護されたルートの定義
const protectedRoutes = {
  admin: ['/admin-dashboard'],
  partner: ['/partner-dashboard'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 管理者ダッシュボードへのアクセス
  if (protectedRoutes.admin.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('admin-token');

    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    const session = await verifyToken(token.value);

    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  // 加盟店ダッシュボードへのアクセス
  if (protectedRoutes.partner.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('partner-token');

    if (!token) {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }

    const session = await verifyToken(token.value);

    if (!session || session.role !== 'partner') {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/partner-dashboard/:path*',
  ],
};