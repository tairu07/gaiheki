import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminSession } from '../../../../lib/auth';

const prisma = new PrismaClient();

// PATCH: 申請ステータス更新（承認・却下）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);

    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const newStatus = data.status; // '審査中', '承認', '却下'

    // ステータスマッピング（データベース用）
    const statusMapping: { [key: string]: string } = {
      '承認': 'APPROVED',
      '却下': 'REJECTED',
      '審査中': 'UNDER_REVIEW'
    };

    const mappedStatus = statusMapping[newStatus] || newStatus;

    try {
      // 現在の申請を取得
      const currentApplication = await prisma.partner_applications.findUnique({
        where: { id: applicationId },
      });

      if (!currentApplication) {
        // データベースエラー時はモック応答
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            success: true,
            message: 'ステータスを更新しました（モック）',
            application: {
              id: applicationId,
              application_status: mappedStatus
            }
          });
        }
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      // 申請を更新（承認時の自動登録は行わない）
      const updatedApplication = await prisma.partner_applications.update({
        where: { id: applicationId },
        data: {
          application_status: mappedStatus as 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW',
          reviewed_by: admin.userId,
          reviewed_at: new Date(),
          updated_at: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: newStatus === '承認'
          ? '申請を承認しました。加盟店管理画面で詳細を確認してください。'
          : newStatus === '却下'
          ? '申請を却下しました。'
          : 'ステータスを更新しました。',
        application: updatedApplication
      });

    } catch (dbError) {
      console.error('Database error:', dbError);

      // 開発環境でデータベースエラーの場合、モック応答を返す
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'ステータスを更新しました（モック）',
          application: {
            id: applicationId,
            application_status: mappedStatus
          }
        });
      }

      throw dbError;
    }

  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: 申請削除（管理者のみ）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);

    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 申請を削除（関連データはカスケード削除）
    await prisma.partner_applications.delete({
      where: { id: applicationId }
    });

    return NextResponse.json({ success: true, message: '申請を削除しました。' });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}