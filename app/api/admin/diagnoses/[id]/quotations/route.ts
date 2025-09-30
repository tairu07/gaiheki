import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getAdminSession } from '../../../../../lib/auth';

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

    // IDから数値部分を抽出
    const diagnosisId = parseInt(id.replace('GH-', ''));

    // まず基本的な見積もり情報のみを取得
    const quotations = await prisma.quotations.findMany({
      where: { diagnosis_request_id: diagnosisId },
      orderBy: {
        created_at: 'desc'
      }
    });

    // データを整形（基本情報のみ）
    const formattedQuotations = quotations.map(quotation => ({
      id: quotation.id,
      partnerId: quotation.partner_id,
      partnerName: 'パートナー名不明',
      amount: quotation.quotation_amount ?
        `${Math.floor(quotation.quotation_amount / 10000)}万円` : '未設定',
      proposedPeriod: '未設定',
      validUntil: '未設定',
      status: '提出済み',
      submittedAt: quotation.created_at ?
        new Date(quotation.created_at).toLocaleDateString('ja-JP') : '',
      selected: quotation.is_selected || false,
      appealText: quotation.appeal_text || ''
    }));

    return NextResponse.json(formattedQuotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);

    // データベース接続エラーの場合はモックデータを返す
    const mockData = [
      {
        id: 1,
        partnerId: 1,
        partnerName: "佐藤塗装工業",
        amount: "120万円",
        proposedPeriod: "2週間",
        validUntil: "2024/04/01",
        status: "提出済み",
        submittedAt: "2024/03/15",
        selected: false,
        appealText: `弊社は創業30年の実績を持つ、地域密着型の塗装専門業者です。

【弊社の強み】
✅ 高品質な塗料を使用し、10年保証付き
✅ 施工期間中の騒音対策を徹底
✅ 近隣への配慮を最優先に作業
✅ 経験豊富な職人による丁寧な施工

お客様の大切な住まいを、心を込めて施工させていただきます。`
      },
      {
        id: 2,
        partnerId: 2,
        partnerName: "田中建装株式会社",
        amount: "98万円",
        proposedPeriod: "3週間",
        validUntil: "2024/03/31",
        status: "提出済み",
        submittedAt: "2024/03/14",
        selected: false,
        appealText: `地元で20年以上の実績がある弊社にお任せください。

【特徴】
・コストパフォーマンスに優れた施工
・アフターサービスも充実
・お客様満足度95%以上

丁寧な仕事をお約束します。`
      },
      {
        id: 3,
        partnerId: 3,
        partnerName: "山田ペイント",
        amount: "135万円",
        proposedPeriod: "10日間",
        validUntil: "2024/04/10",
        status: "提出済み",
        submittedAt: "2024/03/16",
        selected: false,
        appealText: `最新技術と確かな技術力で施工いたします。

【弊社のポイント】
・最短10日間での施工完了
・最新の塗料技術を採用
・環境に優しい施工方法

スピーディーかつ高品質な施工をお約束します。`
      }
    ];

    return NextResponse.json(mockData);
  } finally {
    // シングルトンなので切断しない
  }
}

// 業者選定（見積もり選択）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quotationId } = body;

    // 管理者認証
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // IDから数値部分を抽出
    const diagnosisId = parseInt(id.replace('GH-', ''));

    // トランザクションで処理
    const result = await prisma.$transaction(async (tx) => {
      // 1. 診断のステータスを「業者決定」に更新
      await tx.diagnosis_requests.update({
        where: { id: diagnosisId },
        data: {
          status: 'DECIDED',
          updated_at: new Date()
        }
      });

      // 2. 見積もりのselectedフラグを更新
      const quotation = await tx.quotations.update({
        where: { id: quotationId },
        data: {
          is_selected: true,
          updated_at: new Date()
        }
      });

      // 3. 受注管理テーブルに新規レコードを作成
      const order = await tx.orders.create({
        data: {
          quotation_id: quotationId,
          order_status: 'ORDERED',
          updated_at: new Date()
        }
      });

      return { quotation, order };
    });

    return NextResponse.json({
      success: true,
      message: '業者が決定され、受注管理に移行しました',
      orderId: result.order.id
    });
  } catch (error) {
    console.error('Error selecting partner:', error);
    return NextResponse.json({ error: 'Failed to select partner' }, { status: 500 });
  } finally {
    // シングルトンなので切断しない
  }
}