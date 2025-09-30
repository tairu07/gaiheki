import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 単純なデータベース接続テスト
    await prisma.$connect();

    // Admin テーブルの件数を取得（最もシンプルなクエリ）
    const adminCount = await prisma.admin.count();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      adminCount
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown'
    });
  } finally {
    await prisma.$disconnect();
  }
}