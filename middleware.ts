import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証機能を無効化 - パブリックアクセスを許可
export async function middleware(request: NextRequest) {
  // すべてのリクエストを通す（認証チェックなし）
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
