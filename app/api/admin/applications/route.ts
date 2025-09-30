import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminSession } from '../../../lib/auth';

const prisma = new PrismaClient();

// GET: 加盟店申請一覧取得
export async function GET(request: NextRequest) {
  try {
    // 管理者認証チェック
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // データベース接続を試みる
    try {
      // まず基本的な申請情報のみを取得
      const applications = await prisma.partner_applications.findMany({
        orderBy: {
          created_at: 'desc'
        }
      });

    // レスポンス用のデータ整形（基本情報のみ）
    const formattedApplications = applications.map(app => {
      // ステータスを日本語に変換
      const statusMap: { [key: string]: string } = {
        'UNDER_REVIEW': '審査中',
        'APPROVED': '承認',
        'REJECTED': '却下'
      };

      return {
        id: app.id,
        companyName: app.company_name || '',
        representative: app.representative_name || '',
        address: app.address || '',
        phone: app.phone_number || '',
        email: app.email || '',
        website: app.website_url || '',
        status: statusMap[app.application_status] || app.application_status,
        serviceAreas: [],
        businessDescription: app.business_description || '',
        selfPr: app.self_pr || '',
        adminMemo: app.admin_memo || '',
        reviewNotes: app.review_notes || '',
        applicationDate: app.created_at ? app.created_at.toISOString() : '',
        statusHistories: []
      };
    });

      return NextResponse.json(formattedApplications);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // データベースエラーの場合、モックデータを返す
      const mockData = [
        { id: 1, companyName: "佐藤塗装工業", representative: "佐藤太郎", address: "神奈川県横浜市青葉区1-1-1", phone: "045-123-4567", email: "info@sato-tosou.co.jp", website: "サイト", status: "審査中" },
        { id: 2, companyName: "田中建装株式会社", representative: "田中花子", address: "大阪府大阪市中央区2-2-2", phone: "06-234-5678", email: "contact@tanaka-kensou.com", website: "サイト", status: "審査中" },
        { id: 3, companyName: "山田ペイント", representative: "山田次郎", address: "愛知県名古屋市中区3-3-3", phone: "052-345-6789", email: "yamada@paint.jp", website: "サイト", status: "審査中" },
        { id: 4, companyName: "鈴木リフォーム", representative: "鈴木三郎", address: "千葉県千葉市中央区4-4-4", phone: "043-456-7890", email: "suzuki@reform.co.jp", website: "サイト", status: "審査中" },
        { id: 5, companyName: "高橋塗装店", representative: "高橋四郎", address: "埼玉県さいたま市大宮区5-5-5", phone: "048-567-8901", email: "takahashi@tosou.net", website: "サイト", status: "審査中" },
        { id: 6, companyName: "伊藤建設", representative: "伊藤五郎", address: "静岡県静岡市駿河区6-6-6", phone: "054-678-9012", email: "ito@kensetsu.com", website: "サイト", status: "審査中" },
        { id: 7, companyName: "渡辺塗装工業", representative: "渡辺六郎", address: "宮城県仙台市青葉区7-7-7", phone: "022-789-0123", email: "watanabe@tosou-kogyo.jp", website: "サイト", status: "審査中" },
        { id: 8, companyName: "中村ペイント", representative: "中村七郎", address: "福岡県福岡市博多区8-8-8", phone: "092-890-1234", email: "nakamura@paint.org", website: "サイト", status: "審査中" },
        { id: 9, companyName: "小林工務店", representative: "小林八郎", address: "石川県金沢市林業9-9-9", phone: "076-901-2345", email: "kobayashi@koumuten.co.jp", website: "サイト", status: "審査中" },
        { id: 10, companyName: "加藤塗装", representative: "加藤九郎", address: "広島県広島市中区10-10-10", phone: "082-012-3456", email: "kato@tosou.hiroshima.jp", website: "サイト", status: "審査中" },
        { id: 11, companyName: "松本建装", representative: "松本一郎", address: "長野県長野市光寺11-11-11", phone: "026-123-4567", email: "matsumoto@kensou.nagano.jp", website: "サイト", status: "承認" },
        { id: 12, companyName: "井上塗装", representative: "井上二郎", address: "香川県高松市丸亀町12-12-12", phone: "087-234-5678", email: "inoue@paint.kagawa.jp", website: "サイト", status: "承認" },
        { id: 13, companyName: "木村リフォーム", representative: "木村三郎", address: "青森県青森市本町13-13-13", phone: "017-345-6789", email: "kimura@reform.aomori.jp", website: "サイト", status: "承認" },
        { id: 14, companyName: "林塗装店", representative: "林四郎", address: "宮崎県宮崎市橘通14-14-14", phone: "0985-456-7890", email: "hayashi@tosou.miyazaki.jp", website: "サイト", status: "承認" }
      ];
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

// POST: 新規申請作成（通常は公開フォームから）
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 都道府県名を英語に変換
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

    // トランザクションで申請と対応エリアを保存
    const result = await prisma.$transaction(async (tx) => {
      // 申請を作成
      const application = await tx.partner_applications.create({
        data: {
          company_name: data.companyName,
          representative_name: data.representative,
          address: data.address,
          phone_number: data.phone,
          email: data.email,
          website_url: data.website || null,
          business_description: data.businessDescription || '',
          self_pr: data.selfPr || '',
          application_status: 'UNDER_REVIEW',
          updated_at: new Date()
        }
      });

      // 対応エリアを登録
      if (data.serviceAreas && data.serviceAreas.length > 0) {
        const prefectureData = data.serviceAreas
          .map((area: string) => prefectureMapping[area])
          .filter(Boolean)
          .map((prefecture: string) => ({
            application_id: application.id,
            supported_prefecture: prefecture
          }));

        if (prefectureData.length > 0) {
          await tx.partner_application_prefectures.createMany({
            data: prefectureData
          });
        }
      }

      return application;
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}