# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

外壁塗装マッチングプラットフォーム - 顧客と加盟店（施工業者）を繋ぐBtoBtoC Webアプリケーション

## System Requirements

### User Types
1. **一般顧客**: 見積もり依頼、加盟店検索、コラム閲覧
2. **管理者**: システム全体の管理、審査、業者決定
3. **加盟店**: 見積もり提出、受注管理、施工管理

### Core Business Flows

#### 1. 問い合わせフロー
顧客問い合わせ → 管理者対応 → ステータス更新 → 完了

#### 2. 受注フロー
- **パターンA（加盟店指定）**: 顧客が加盟店選択 → 見積もり依頼 → 管理者が業者決定 → 受注
- **パターンB（複数見積もり）**: 顧客が一般依頼 → 複数加盟店が見積もり → 管理者が選定 → 受注

#### 3. 加盟店登録フロー
申請 → 審査 → 承認 → アカウント発行

#### 4. 施工完了フロー
施工完了 → 評価URL発行 → 顧客評価 → 完了

## Architecture

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4
- **Rendering**: Server-Side Rendering (SSR) 優先
- **Authentication**: JWT + HttpOnly Cookies
- **Validation**: Zod
- **State Management**: Server State (React Server Components)

### Directory Structure
```
app/
├── (public)/                 # 一般公開サイト
│   ├── page.tsx             # トップページ
│   ├── areas/               # 都道府県別加盟店一覧
│   ├── partners/            # 加盟店詳細
│   ├── columns/             # コラム
│   ├── diagnosis/           # 見積もり依頼
│   ├── inquiry/             # 問い合わせ
│   └── partner-apply/       # 加盟店申請
├── (admin)/                  # 管理者ダッシュボード
│   ├── admin-login/         # ログイン
│   └── admin-dashboard/
│       ├── partners/        # 加盟店管理
│       ├── applications/    # 加盟店申請
│       ├── diagnoses/       # 診断管理
│       ├── orders/          # 受注管理
│       ├── inquiries/       # 問い合わせ管理
│       └── columns/         # コラム管理
├── (partner)/               # 加盟店ダッシュボード
│   ├── partner-login/       # ログイン
│   └── partner-dashboard/
│       ├── company-info/    # 会社情報
│       ├── diagnoses/       # 診断管理
│       ├── orders/          # 受注管理
│       └── reviews/         # 口コミ閲覧
├── api/                     # API Routes
├── components/              # 共通コンポーネント
└── lib/                     # ユーティリティ
```

## Component Architecture

### Design Principles
1. **Server Components by Default**: データフェッチはサーバー側で実行
2. **Client Components**: インタラクティブな部分のみ使用
3. **Component Composition**: 小さく再利用可能なコンポーネント
4. **Type Safety**: 全てのコンポーネントで型定義必須

### Core Components
```typescript
// Server Components (SSR)
components/
├── Layout/
│   ├── PublicLayout.tsx
│   ├── AdminLayout.tsx
│   └── PartnerLayout.tsx
├── DataDisplay/
│   ├── PartnerList.tsx      # 加盟店一覧
│   ├── DiagnosisTable.tsx   # 診断一覧
│   └── OrderTable.tsx       # 受注一覧
└── Forms/
    ├── DiagnosisForm.tsx     # 見積もり依頼
    ├── ApplicationForm.tsx   # 加盟店申請
    └── InquiryForm.tsx      # 問い合わせ

// Client Components ('use client')
components/
├── Interactive/
│   ├── StatusSelect.tsx     # ステータス変更
│   ├── QuotationModal.tsx   # 見積もり入力
│   └── FilterControls.tsx   # フィルター
└── Auth/
    ├── LoginForm.tsx         # ログインフォーム
    └── LogoutButton.tsx      # ログアウト
```

## Database Schema Key Points

### Unique Features
1. **診断コード**: GH00001形式の連番（永続的）
2. **価格帯**: 施工実績から動的算出（保存しない）
3. **評価トークン**: 30日有効、1回のみ使用可
4. **ステータス自動遷移**: 見積もり件数でステータス変更

### Data Flow
```
diagnosis_requests → quotations → orders → customers (review)
     ↓                    ↓          ↓          ↓
status: RECRUITING → COMPARING → DECIDED → COMPLETED
```

## Development Commands
```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # ESLint
npm run db:migrate   # Prismaマイグレーション
npm run db:seed      # テストデータ投入
npm run db:studio    # Prisma Studio起動
```

## Implementation Guidelines

### SSR Best Practices
```typescript
// ✅ Good: Server Component with data fetching
// app/areas/[prefecture]/page.tsx
export default async function PrefecturePage({ params }) {
  const partners = await prisma.partners.findMany({
    where: { prefectures: { some: { prefecture: params.prefecture } } },
    include: { details: true }
  });

  return <PartnerList partners={partners} />;
}

// ✅ Good: Client Component for interactivity only
// components/Interactive/StatusSelect.tsx
'use client';
export function StatusSelect({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  // Interactive logic here
}
```

### API Route Pattern
```typescript
// app/api/[resource]/route.ts
export async function GET(request: Request) {
  // Validate auth
  const session = await validateSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch data with Prisma
  const data = await prisma.model.findMany();

  // Return JSON
  return NextResponse.json(data);
}
```

### Form Handling
```typescript
// Server Action (Recommended)
async function createDiagnosis(formData: FormData) {
  'use server';

  // Validate
  const parsed = diagnosisSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error };

  // Create
  const diagnosis = await prisma.diagnosis_requests.create({
    data: {
      ...parsed.data,
      diagnosis_code: await generateDiagnosisCode(),
    }
  });

  // Redirect
  redirect(`/diagnosis/${diagnosis.id}`);
}
```

## Security Considerations
1. **Authentication**: JWT in HttpOnly cookies
2. **Authorization**: Role-based access control
3. **Input Validation**: Zod schemas for all inputs
4. **SQL Injection**: Prisma parameterized queries
5. **XSS Protection**: React escaping + CSP headers
6. **CSRF Protection**: SameSite cookies + tokens

## Performance Optimization
1. **Static Generation**: コラムページはISR
2. **Dynamic Rendering**: ダッシュボードはSSR
3. **Caching**: Unstable_cache for expensive queries
4. **Image Optimization**: Next.js Image component
5. **Bundle Size**: Dynamic imports for modals

## Testing Strategy
1. **Unit Tests**: Components with React Testing Library
2. **Integration Tests**: API routes with Supertest
3. **E2E Tests**: Critical flows with Playwright
4. **Type Checking**: TypeScript strict mode

## Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Initial admin account created
- [ ] Test data removed
- [ ] Error tracking setup
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented

## Common Patterns

### Status Badge Component
```typescript
export function StatusBadge({ status }: { status: string }) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}
```

### Data Table with Server-Side Pagination
```typescript
export async function PartnerTable({ searchParams }) {
  const { page = 1, limit = 10 } = searchParams;

  const partners = await prisma.partners.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { details: true }
  });

  const total = await prisma.partners.count();

  return (
    <>
      <Table data={partners} />
      <Pagination total={total} page={page} limit={limit} />
    </>
  );
}
```

## Important Notes
- Always prefer SSR over client-side rendering for better SEO and performance
- Use Server Actions for form submissions instead of API routes
- Implement proper error boundaries for each route
- Keep components small and focused on a single responsibility
- Document complex business logic with comments
- Test critical user flows thoroughly