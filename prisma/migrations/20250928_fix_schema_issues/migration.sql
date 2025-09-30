-- 修正1: partner_detailsテーブルに価格帯フィールドを追加（既に追加済みの場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_details' AND column_name = 'price_range_min') THEN
        ALTER TABLE "partner_details" ADD COLUMN "price_range_min" INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partner_details' AND column_name = 'price_range_max') THEN
        ALTER TABLE "partner_details" ADD COLUMN "price_range_max" INTEGER;
    END IF;
END $$;

-- 修正2: customersテーブルにレビュー用トークンフィールドを追加（既に追加済みの場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'review_token') THEN
        ALTER TABLE "customers" ADD COLUMN "review_token" VARCHAR(255) UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'review_token_expires_at') THEN
        ALTER TABLE "customers" ADD COLUMN "review_token_expires_at" TIMESTAMP;
    END IF;
END $$;

-- 修正3: diagnosis_requestsテーブルに診断コードを追加（既に追加済みの場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'diagnosis_requests' AND column_name = 'diagnosis_code') THEN
        ALTER TABLE "diagnosis_requests" ADD COLUMN "diagnosis_code" VARCHAR(10) UNIQUE;
    END IF;
END $$;

-- 修正4: partner_application_prefecturesのカラム名を修正
-- まず、テーブルが存在するか確認
DO $$
BEGIN
    -- カラムが存在する場合のみリネーム
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partner_application_prefectures'
        AND column_name = 'partner_id'
    ) THEN
        -- 外部キー制約を一旦削除
        ALTER TABLE "partner_application_prefectures"
        DROP CONSTRAINT IF EXISTS "partner_application_prefectures_partner_id_fkey";

        -- カラム名を変更
        ALTER TABLE "partner_application_prefectures"
        RENAME COLUMN "partner_id" TO "application_id";

        -- 新しい外部キー制約を追加
        ALTER TABLE "partner_application_prefectures"
        ADD CONSTRAINT "partner_application_prefectures_application_id_fkey"
        FOREIGN KEY ("application_id") REFERENCES "partner_applications"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- 修正5: 診断コードの初期値を設定
UPDATE "diagnosis_requests"
SET "diagnosis_code" = CONCAT('GH', LPAD(id::text, 5, '0'))
WHERE "diagnosis_code" IS NULL;

-- 修正6: partner_detailsの価格帯に初期値を設定
UPDATE "partner_details"
SET "price_range_min" = 50,
    "price_range_max" = 500
WHERE "price_range_min" IS NULL OR "price_range_max" IS NULL;