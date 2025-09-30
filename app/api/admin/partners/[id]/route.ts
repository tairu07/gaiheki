import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminSession } from '../../../../lib/auth';

const prisma = new PrismaClient();

// PUT: パートナー情報更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const partnerId = parseInt(id);
    const data = await request.json();

    // トランザクションで更新
    await prisma.$transaction(async (tx) => {
      // 1. パートナーアカウント更新
      await tx.partners.update({
        where: { id: partnerId },
        data: {
          is_active: data.status === '表示',
          updated_at: new Date()
        }
      });

      // 2. パートナー詳細情報更新
      const existingDetail = await tx.partner_details.findUnique({
        where: { partner_id: partnerId }
      });

      if (existingDetail) {
        await tx.partner_details.update({
          where: { partner_id: partnerId },
          data: {
            company_name: data.companyName,
            phone_number: data.phone,
            address: data.address || '',
            representative_name: data.representativeName || '',
            website_url: data.website || null,
            business_description: data.businessDescription || '',
            appeal_text: data.appealText || '',
            business_hours: data.businessHours || '9:00-18:00',
            closed_days: data.closedDays || '日曜・祝日',
            partners_status: data.status === '表示' ? 'ACTIVE' : 'INACTIVE',
            updated_at: new Date()
          }
        });
      }

      // 3. 対応都道府県を更新（一旦削除して再作成）
      await tx.partner_prefectures.deleteMany({
        where: { partner_id: partnerId }
      });

      if (data.serviceAreas && data.serviceAreas.length > 0) {
        const prefectureMapping: { [key: string]: string } = {
          '東京都': 'Tokyo',
          '神奈川県': 'Kanagawa',
          '埼玉県': 'Saitama',
          '千葉県': 'Chiba',
          '大阪府': 'Osaka',
          '愛知県': 'Aichi',
          '福岡県': 'Fukuoka',
          '北海道': 'Hokkaido',
          '宮城県': 'Miyagi',
          '広島県': 'Hiroshima',
          '青森県': 'Aomori',
          '岩手県': 'Iwate',
          '秋田県': 'Akita',
          '山形県': 'Yamagata',
          '福島県': 'Fukushima',
          '茨城県': 'Ibaraki',
          '栃木県': 'Tochigi',
          '群馬県': 'Gunma',
          '新潟県': 'Niigata',
          '富山県': 'Toyama',
          '石川県': 'Ishikawa',
          '福井県': 'Fukui',
          '山梨県': 'Yamanashi',
          '長野県': 'Nagano',
          '岐阜県': 'Gifu',
          '静岡県': 'Shizuoka',
          '三重県': 'Mie',
          '滋賀県': 'Shiga',
          '京都府': 'Kyoto',
          '兵庫県': 'Hyogo',
          '奈良県': 'Nara',
          '和歌山県': 'Wakayama',
          '鳥取県': 'Tottori',
          '島根県': 'Shimane',
          '岡山県': 'Okayama',
          '山口県': 'Yamaguchi',
          '徳島県': 'Tokushima',
          '香川県': 'Kagawa',
          '愛媛県': 'Ehime',
          '高知県': 'Kochi',
          '佐賀県': 'Saga',
          '長崎県': 'Nagasaki',
          '熊本県': 'Kumamoto',
          '大分県': 'Oita',
          '宮崎県': 'Miyazaki',
          '鹿児島県': 'Kagoshima',
          '沖縄県': 'Okinawa'
        };

        const prefectureData = data.serviceAreas
          .map((area: string) => {
            const mapped = prefectureMapping[area];
            // もしマッピングがない場合は、デフォルトのものを試す
            if (!mapped && area === data.prefecture) {
              return prefectureMapping[data.prefecture];
            }
            return mapped;
          })
          .filter(Boolean)
          .map((prefecture: string) => ({
            partner_id: partnerId,
            supported_prefecture: prefecture,
            updated_at: new Date()
          }));

        if (prefectureData.length > 0) {
          await tx.partner_prefectures.createMany({
            data: prefectureData
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update partner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: パートナー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const partnerId = parseInt(id);

    // カスケード削除設定があるので、partnersを削除すれば関連データも削除される
    await prisma.partners.delete({
      where: { id: partnerId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete partner:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH: ステータスのみ更新（クイック更新用）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const partnerId = parseInt(id);
    const { status } = await request.json();

    await prisma.$transaction(async (tx) => {
      // パートナーアカウントのアクティブ状態を更新
      await tx.partners.update({
        where: { id: partnerId },
        data: {
          is_active: status === '表示',
          updated_at: new Date()
        }
      });

      // パートナー詳細のステータスも更新
      const detail = await tx.partner_details.findUnique({
        where: { partner_id: partnerId }
      });

      if (detail) {
        await tx.partner_details.update({
          where: { partner_id: partnerId },
          data: {
            partners_status: status === '表示' ? 'ACTIVE' : 'INACTIVE',
            updated_at: new Date()
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update partner status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}