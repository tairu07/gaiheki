import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 診断コードの生成
function generateDiagnosisCode(index: number): string {
  return `GH${String(index).padStart(5, '0')}`;
}

async function main() {
  console.log('🌱 Starting seed...');

  // 1. 管理者アカウントの作成
  console.log('Creating admin accounts...');
  const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const defaultAdmin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@gaiheki.com',
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  // 2. 加盟店の作成（東京中心）
  console.log('Creating partners...');
  const partnerPasswords = await Promise.all(
    Array(15).fill(null).map(() => bcrypt.hash('password123', 12))
  );

  const prefectures = [
    'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', 'Tokyo', // 7社
    'Kanagawa', 'Kanagawa', // 2社
    'Saitama', 'Saitama', // 2社
    'Osaka', 'Fukuoka', 'Aichi', // 各1社
  ];

  const partners = await Promise.all(
    prefectures.map(async (prefecture, i) => {
      const existingPartner = await prisma.partners.findUnique({
        where: { username: `partner${i + 1}` },
      });

      if (existingPartner) {
        return existingPartner;
      }

      const partner = await prisma.partners.create({
        data: {
          username: `partner${i + 1}`,
          login_email: `partner${i + 1}@example.com`,
          password_hash: partnerPasswords[i],
          is_active: true,
          partner_details: {
            create: {
              company_name: `${prefecture}塗装工業 ${i + 1}号店`,
              phone_number: `03-${String(1111 + i).padStart(4, '0')}-${String(1111 + i).padStart(4, '0')}`,
              address: `${prefecture}都中央区1-2-${i + 1}`,
              representative_name: `代表者${i + 1}`,
              website_url: `https://example${i + 1}.com`,
              business_description: `${prefecture}で外壁塗装を専門に行っています。創業${20 - i}年の実績があります。`,
              appeal_text: `お客様満足度No.1を目指して、丁寧な施工を心がけています。`,
              business_hours: '9:00-18:00',
              closed_days: '日曜・祝日',
              partners_status: i < 12 ? 'ACTIVE' : 'INACTIVE',
              updated_at: new Date(),
            },
          },
          partner_prefectures: {
            create: [
              { supported_prefecture: prefecture as any, updated_at: new Date() },
              ...(i < 3 ? [{ supported_prefecture: 'Chiba' as any, updated_at: new Date() }] : []),
            ],
          },
          updated_at: new Date(),
        },
      });
      return partner;
    })
  );

  // 3. 加盟店申請の作成
  console.log('Creating partner applications...');
  const applicationStatuses = [
    'UNDER_REVIEW', 'UNDER_REVIEW', 'UNDER_REVIEW',
    'APPROVED', 'APPROVED', 'APPROVED', 'APPROVED', 'APPROVED',
    'REJECTED', 'REJECTED',
  ];

  for (let i = 0; i < applicationStatuses.length; i++) {
    const status = applicationStatuses[i];
    const existingApp = await prisma.partner_applications.findFirst({
      where: { company_name: `新規申請会社${i + 1}` },
    });

    if (!existingApp) {
      await prisma.partner_applications.create({
        data: {
          company_name: `新規申請会社${i + 1}`,
          representative_name: `申請者${i + 1}`,
          address: `東京都新宿区${i + 1}-${i + 1}-${i + 1}`,
          phone_number: `090-${String(1111 + i).padStart(4, '0')}-${String(1111 + i).padStart(4, '0')}`,
          email: `apply${i + 1}@example.com`,
          website_url: `https://new-company${i + 1}.com`,
          business_description: `外壁塗装業を営んでおります。`,
          self_pr: `地域密着で頑張っています。`,
          application_status: status as any,
          reviewed_by: status !== 'UNDER_REVIEW' ? defaultAdmin.id : null,
          reviewed_at: status !== 'UNDER_REVIEW' ? new Date() : null,
          updated_at: new Date(),
          partner_application_prefectures: {
            create: [
              { supported_prefecture: 'Tokyo' },
              { supported_prefecture: 'Kanagawa' },
            ],
          },
        },
      });
    }
  }

  // 4. 顧客データの作成
  console.log('Creating customers...');
  const customerStatuses = ['ORDERED', 'IN_PROGRESS', 'COMPLETED', 'REVIEW_COMPLETED'];
  const customers: any[] = [];

  for (let i = 0; i < 50; i++) {
    const status = customerStatuses[i % customerStatuses.length];
    const partnerId = partners[i % partners.length].id;

    const existingCustomer = await prisma.customers.findFirst({
      where: { customer_email: `customer${i + 1}@example.com` },
    });

    if (!existingCustomer) {
      const customer = await prisma.customers.create({
        data: {
          partner_id: status !== 'ORDERED' ? partnerId : null,
          customer_name: `顧客${i + 1}`,
          customer_phone: `080-${String(1111 + i).padStart(4, '0')}-${String(1111 + i).padStart(4, '0')}`,
          customer_email: `customer${i + 1}@example.com`,
          construction_address: `東京都${i % 2 === 0 ? '世田谷' : '杉並'}区${i + 1}-${i + 1}-${i + 1}`,
          customer_construction_type: ['EXTERIOR_PAINTING', 'ROOF_PAINTING', 'EXTERIOR_AND_ROOF'][i % 3] as any,
          construction_amount: 800000 + (i * 50000),
          customer_status: status as any,
          customer_rating: status === 'REVIEW_COMPLETED' ? 4 + (i % 2) : null,
          customer_review_title: status === 'REVIEW_COMPLETED' ? `大変満足です${i + 1}` : null,
          customer_review: status === 'REVIEW_COMPLETED' ? `職人さんの対応も良く、仕上がりも綺麗で満足しています。` : null,
          customer_review_date: status === 'REVIEW_COMPLETED' ? new Date() : null,
          updated_at: new Date(),
        },
      });
      customers.push(customer);
    } else {
      customers.push(existingCustomer);
    }
  }

  // 5. 診断依頼の作成
  console.log('Creating diagnosis requests...');
  const diagnosisStatuses = ['DESIGNATED', 'RECRUITING', 'COMPARING', 'DECIDED', 'CANCELLED'];
  const diagnosisRequests: any[] = [];

  for (let i = 0; i < 50; i++) {
    const status = diagnosisStatuses[i % diagnosisStatuses.length];
    const customerId = customers[i % customers.length].id;
    const isDesignated = status === 'DESIGNATED' || i < 10;
    const diagnosisCode = generateDiagnosisCode(i + 1);

    const existingDiagnosis = await prisma.diagnosis_requests.findUnique({
      where: { diagnosis_code: diagnosisCode },
    });

    if (!existingDiagnosis) {
      const diagnosis = await prisma.diagnosis_requests.create({
        data: {
          diagnosis_code: diagnosisCode,
          customer_id: customerId,
          preferred_partner_id: isDesignated ? partners[i % partners.length].id : null,
          prefecture: prefectures[i % prefectures.length] as any,
          floor_area: ['FROM_80_TO_100', 'FROM_101_TO_120', 'FROM_121_TO_140'][i % 3] as any,
          current_situation: ['MARKET_RESEARCH', 'CONSIDERING_CONSTRUCTION', 'COMPARING_CONTRACTORS'][i % 3] as any,
          construction_type: ['EXTERIOR_PAINTING', 'ROOF_PAINTING', 'EXTERIOR_AND_ROOF'][i % 3] as any,
          status: status as any,
          updated_at: new Date(),
        },
      });
      diagnosisRequests.push(diagnosis);
    } else {
      diagnosisRequests.push(existingDiagnosis);
    }
  }

  // 6. 見積もりの作成
  console.log('Creating quotations...');
  for (const diagnosis of diagnosisRequests) {
    if (diagnosis.status === 'COMPARING' || diagnosis.status === 'DECIDED') {
      const existingQuotations = await prisma.quotations.findMany({
        where: { diagnosis_request_id: diagnosis.id },
      });

      if (existingQuotations.length === 0) {
        const quotationCount = 2 + Math.floor(Math.random() * 4);
        const eligiblePartners = partners.slice(0, quotationCount);

        await Promise.all(
          eligiblePartners.map(async (partner, index) => {
            const existing = await prisma.quotations.findUnique({
              where: {
                diagnosis_request_id_partner_id: {
                  diagnosis_request_id: diagnosis.id,
                  partner_id: partner.id,
                },
              },
            });

            if (!existing) {
              await prisma.quotations.create({
                data: {
                  diagnosis_request_id: diagnosis.id,
                  partner_id: partner.id,
                  quotation_amount: 800000 + (index * 100000) + Math.floor(Math.random() * 200000),
                  appeal_text: `弊社なら高品質な施工をお約束します。`,
                  is_selected: diagnosis.status === 'DECIDED' && index === 0,
                  updated_at: new Date(),
                },
              });
            }
          })
        );
      }
    }
  }

  // 7. 受注の作成
  console.log('Creating orders...');
  const decidedDiagnoses = diagnosisRequests.filter(d => d.status === 'DECIDED');
  for (const diagnosis of decidedDiagnoses.slice(0, 30)) {
    const quotation = await prisma.quotations.findFirst({
      where: {
        diagnosis_request_id: diagnosis.id,
        is_selected: true,
      },
    });

    if (quotation) {
      const existingOrder = await prisma.orders.findUnique({
        where: { quotation_id: quotation.id },
      });

      if (!existingOrder) {
        await prisma.orders.create({
          data: {
            quotation_id: quotation.id,
            partner_memo: '施工予定通り進んでいます。',
            construction_start_date: new Date(),
            construction_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            order_status: ['ORDERED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 3)] as any,
            updated_at: new Date(),
          },
        });
      }
    }
  }

  // 8. 問い合わせの作成
  console.log('Creating inquiries...');
  const inquiryStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  for (let i = 0; i < 20; i++) {
    const customerId = customers[i % customers.length].id;

    const existingInquiry = await prisma.inquiries.findFirst({
      where: {
        customer_id: customerId,
        subject: `見積もりについて${i + 1}`,
      },
    });

    if (!existingInquiry) {
      await prisma.inquiries.create({
        data: {
          customer_id: customerId,
          subject: `見積もりについて${i + 1}`,
          inquiry_content: `外壁塗装の見積もりをお願いしたいのですが、どのような流れになりますか？`,
          inquiry_status: inquiryStatuses[i % inquiryStatuses.length] as any,
          admin_memo: i % 2 === 0 ? '電話で対応済み' : null,
          updated_at: new Date(),
        },
      });
    }
  }

  // 9. コラムの作成
  console.log('Creating articles...');
  const categories = [
    'BASIC_KNOWLEDGE', 'PAINT_TYPES', 'CASE_STUDIES', 'MAINTENANCE',
    'CONTRACTOR_SELECTION', 'COST_ESTIMATE', 'TROUBLESHOOTING', 'SEASONAL_WEATHER',
  ];

  for (let i = 0; i < 30; i++) {
    const existingArticle = await prisma.articles.findFirst({
      where: { post_name: `article-${i + 1}` },
    });

    if (!existingArticle) {
      await prisma.articles.create({
        data: {
          admin_id: defaultAdmin.id,
          title: `外壁塗装の基礎知識 その${i + 1}`,
          thumbnail_image: `https://example.com/images/article${i + 1}.jpg`,
          category: categories[i % categories.length] as any,
          content: `<h2>はじめに</h2><p>外壁塗装は家を守る大切なメンテナンスです。</p><h2>ポイント</h2><p>定期的な点検が重要です。</p>`,
          is_published: true,
          sort_order: i,
          post_name: `article-${i + 1}`,
          updated_at: new Date(),
        },
      });
    }
  }

  // 10. コラム (columns) の作成
  console.log('Creating columns...');
  const columnCategories = [
    '外壁塗装の基礎知識',
    '塗料の種類と特徴',
    '施工事例',
    'メンテナンス',
    '業者選びのポイント',
    '費用・見積もり',
    'トラブル対処法',
    '季節・天候',
  ];

  const columnTitles = [
    '外壁塗装の基本的な流れとは？初心者にもわかりやすく解説',
    'シリコン塗料とウレタン塗料の違いと選び方',
    '一戸建て外壁塗装の施工事例をご紹介',
    '外壁の劣化症状と適切なメンテナンス時期',
    '優良な塗装業者を見分けるポイント5選',
    '外壁塗装の費用相場と見積もりのチェックポイント',
    '外壁塗装でよくあるトラブルと対処法',
    '季節ごとの外壁塗装のメリット・デメリット',
    'フッ素塗料の特徴と長期的なコストパフォーマンス',
    '外壁塗装の色選びで失敗しないコツ',
    '塗装工事中の近隣対応マナー',
    '外壁材別の塗装方法と注意点',
    '下塗り・中塗り・上塗りの役割とは',
    '雨漏りを防ぐための外壁塗装のポイント',
    '塗装の耐用年数と塗り替え時期の見極め方',
  ];

  for (let i = 0; i < Math.min(columnTitles.length, 15); i++) {
    const title = columnTitles[i];
    const category = columnCategories[i % columnCategories.length];
    const slug = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    const existingColumn = await prisma.columns.findUnique({
      where: { slug },
    });

    if (!existingColumn) {
      await prisma.columns.create({
        data: {
          title,
          slug,
          category,
          content: `<h2>はじめに</h2><p>${title}について詳しく解説します。</p><h2>ポイント</h2><p>重要なポイントをまとめました。</p><h2>まとめ</h2><p>適切な知識を身につけて、外壁塗装を成功させましょう。</p>`,
          thumbnail_url: `https://example.com/images/column${i + 1}.jpg`,
          status: i % 4 === 0 ? 'draft' : 'published',
          views: Math.floor(Math.random() * 1000) + 50,
          updated_at: new Date(),
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('📊 Summary:');
  console.log(`  - Admin: 1 (admin@gaiheki.com / admin123)`);
  console.log(`  - Partners: ${partners.length}`);
  console.log(`  - Partner Applications: ${applicationStatuses.length}`);
  console.log(`  - Customers: ${customers.length}`);
  console.log(`  - Diagnosis Requests: ${diagnosisRequests.length}`);
  console.log(`  - Inquiries: 20`);
  console.log(`  - Articles: 30`);
  console.log(`  - Columns: 15`);

  console.log('\n📋 ログイン情報:');
  console.log('┌────────────┬─────────────────────┬─────────────┐');
  console.log('│ 種別       │ ユーザー名/メール   │ パスワード  │');
  console.log('├────────────┼─────────────────────┼─────────────┤');
  console.log('│ 管理者     │ admin@gaiheki.com   │ admin123    │');
  console.log('│ 加盟店     │ partner1@example.com│ password123 │');
  console.log('└────────────┴─────────────────────┴─────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });