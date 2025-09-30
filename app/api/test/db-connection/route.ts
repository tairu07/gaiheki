import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    // データベース接続テスト
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    // テーブル数を取得（BigIntを文字列に変換）
    const tableCount = await prisma.$queryRaw<{count: bigint}[]>`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    // 接続情報
    const connectionInfo = {
      status: 'connected',
      timestamp: new Date().toISOString(),
      database: process.env.DATABASE_URL ? 'Configured' : 'Not configured',
      tables: Number(tableCount[0].count),
      testQuery: result,
    };

    return NextResponse.json({
      success: true,
      ...connectionInfo
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return NextResponse.json({
      success: false,
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: (error as Error & { code?: string })?.code || 'UNKNOWN',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}