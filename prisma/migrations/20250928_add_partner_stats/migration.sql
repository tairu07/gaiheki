-- パートナー詳細テーブルに統計フィールドを追加
ALTER TABLE "partner_details" ADD COLUMN IF NOT EXISTS "total_rating" DECIMAL(2,1) DEFAULT 0;
ALTER TABLE "partner_details" ADD COLUMN IF NOT EXISTS "review_count" INTEGER DEFAULT 0;
ALTER TABLE "partner_details" ADD COLUMN IF NOT EXISTS "completed_count" INTEGER DEFAULT 0;
ALTER TABLE "partner_details" ADD COLUMN IF NOT EXISTS "average_price" INTEGER;

-- パートナー資格テーブルの作成
CREATE TABLE IF NOT EXISTS "partner_certifications" (
  "id" SERIAL PRIMARY KEY,
  "partner_id" INTEGER NOT NULL REFERENCES "partners"("id") ON DELETE CASCADE,
  "certification_name" VARCHAR(255) NOT NULL,
  "certification_number" VARCHAR(100),
  "issued_date" DATE,
  "expiry_date" DATE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS "idx_partner_certifications_partner_id" ON "partner_certifications"("partner_id");

-- 既存データの更新（施工実績を計算）
UPDATE "partner_details" pd
SET "completed_count" = (
  SELECT COUNT(*)
  FROM "quotations" q
  INNER JOIN "orders" o ON o."quotation_id" = q."id"
  WHERE q."partner_id" = pd."partner_id"
  AND o."order_status" IN ('COMPLETED', 'REVIEW_COMPLETED')
);

-- レビュー数の更新（customersテーブルから計算）
UPDATE "partner_details" pd
SET "review_count" = (
  SELECT COUNT(*)
  FROM "customers" c
  WHERE c."partner_id" = pd."partner_id"
  AND c."customer_rating" IS NOT NULL
);

-- 平均評価の更新
UPDATE "partner_details" pd
SET "total_rating" = (
  SELECT AVG(c."customer_rating")
  FROM "customers" c
  WHERE c."partner_id" = pd."partner_id"
  AND c."customer_rating" IS NOT NULL
);

-- 平均価格の更新
UPDATE "partner_details" pd
SET "average_price" = (
  SELECT AVG(c."construction_amount") / 10000  -- 円を万円に変換
  FROM "customers" c
  WHERE c."partner_id" = pd."partner_id"
  AND c."construction_amount" IS NOT NULL
);

-- 価格帯の更新（実績から計算）
UPDATE "partner_details" pd
SET
  "price_range_min" = COALESCE((
    SELECT MIN(c."construction_amount") / 10000
    FROM "customers" c
    WHERE c."partner_id" = pd."partner_id"
    AND c."construction_amount" > 0
  ), 50),
  "price_range_max" = COALESCE((
    SELECT MAX(c."construction_amount") / 10000
    FROM "customers" c
    WHERE c."partner_id" = pd."partner_id"
    AND c."construction_amount" > 0
  ), 500);

-- サンプル資格データの挿入（既存のパートナー用）
INSERT INTO "partner_certifications" ("partner_id", "certification_name", "certification_number", "issued_date", "updated_at")
SELECT
  p."id",
  '建設業許可（塗装工事業）',
  'A-' || LPAD(p."id"::text, 6, '0'),
  '2020-01-01'::DATE,
  CURRENT_TIMESTAMP
FROM "partners" p
WHERE NOT EXISTS (
  SELECT 1 FROM "partner_certifications" pc
  WHERE pc."partner_id" = p."id"
  AND pc."certification_name" = '建設業許可（塗装工事業）'
);

-- 一級塗装技能士の資格を追加（一部のパートナーのみ）
INSERT INTO "partner_certifications" ("partner_id", "certification_name", "certification_number", "issued_date", "updated_at")
SELECT
  p."id",
  '一級塗装技能士',
  'T1-' || LPAD(p."id"::text, 5, '0'),
  '2019-04-01'::DATE,
  CURRENT_TIMESTAMP
FROM "partners" p
WHERE p."id" % 2 = 0  -- 偶数IDのパートナーのみ
AND NOT EXISTS (
  SELECT 1 FROM "partner_certifications" pc
  WHERE pc."partner_id" = p."id"
  AND pc."certification_name" = '一級塗装技能士'
);