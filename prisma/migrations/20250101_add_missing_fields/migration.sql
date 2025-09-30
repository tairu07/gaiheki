

-- 診断コード（GH00001形式）の追加
ALTER TABLE "diagnosis_requests" ADD COLUMN "diagnosis_code" VARCHAR(10) UNIQUE;

-- 価格帯表示用フィールドの追加
ALTER TABLE "partner_details" ADD COLUMN "price_range_min" INTEGER;
ALTER TABLE "partner_details" ADD COLUMN "price_range_max" INTEGER;

-- 評価フォームURL用トークンの追加
ALTER TABLE "customers" ADD COLUMN "review_token" VARCHAR(255);
ALTER TABLE "customers" ADD COLUMN "review_token_expires_at" TIMESTAMP;