import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

// 診断情報の取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 管理者認証
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // IDから数値部分を抽出（GH-00001 → 1）
    const diagnosisId = parseInt(id.replace('GH-', ''));

    const diagnosis = await prisma.diagnosis_requests.findUnique({
      where: { id: diagnosisId }
    });

    if (!diagnosis) {
      return NextResponse.json({ error: 'Diagnosis not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: `GH-${String(diagnosis.id).padStart(5, '0')}`,
      customerName: '顧客名不明',
      age: diagnosis.floor_area || '不明',
      issue: diagnosis.current_situation || '',
      workType: diagnosis.construction_type || '',
      requestDate: diagnosis.created_at ?
        new Date(diagnosis.created_at).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '年').replace(/年(\d{2})/, '年$1月').replace(/月(\d{2})/, '月$1日') : '',
      status: diagnosis.status || '見積もり募集中',
      isUrgent: false
    });
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    return NextResponse.json({ error: 'Failed to fetch diagnosis' }, { status: 500 });
  } finally {
    // シングルトンなので切断しない
  }
}

// 診断ステータスの更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, selectedPartnerId } = body;

    // 管理者認証
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // IDから数値部分を抽出
    const diagnosisId = parseInt(id.replace('GH-', ''));

    // ステータスを英語のenumに変換
    const statusMapping: { [key: string]: string } = {
      '業者指定': 'DESIGNATED',
      '見積もり募集中': 'RECRUITING',
      '見積もり比較中': 'COMPARING',
      '業者決定': 'DECIDED',
      'キャンセル': 'CANCELLED'
    };
    const mappedStatus = statusMapping[status] || status;

    // 診断ステータスを更新
    const updatedDiagnosis = await prisma.diagnosis_requests.update({
      where: { id: diagnosisId },
      data: {
        status: mappedStatus,
        updated_at: new Date()
      }
    });

    // 業者決定の場合、受注管理テーブルに新規レコードを作成
    if (status === '業者決定' && selectedPartnerId) {
      // 選定された見積もりの情報を取得
      const quotation = await prisma.quotations.findFirst({
        where: {
          diagnosis_request_id: diagnosisId,
          partner_id: selectedPartnerId
        }
      });

      if (quotation) {
        // 受注管理テーブルに新規レコードを作成（正しいスキーマに合わせて修正）
        await prisma.orders.create({
          data: {
            quotation_id: quotation.id,
            order_status: 'ORDERED',
            updated_at: new Date()
          }
        });

        // 見積もりのselectedフラグを更新
        await prisma.quotations.update({
          where: { id: quotation.id },
          data: {
            is_selected: true,
            updated_at: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      diagnosis: {
        id: `GH-${String(updatedDiagnosis.id).padStart(5, '0')}`,
        status: updatedDiagnosis.status
      }
    });
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    return NextResponse.json({ error: 'Failed to update diagnosis' }, { status: 500 });
  } finally {
    // シングルトンなので切断しない
  }
}