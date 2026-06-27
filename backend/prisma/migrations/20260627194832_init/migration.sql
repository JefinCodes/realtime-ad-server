-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'active', 'paused', 'ended');

-- CreateTable
CREATE TABLE "advertisers" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "wallet_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL,
    "advertiser_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "bid" DECIMAL(10,4) NOT NULL,
    "budget" DECIMAL(12,2) NOT NULL,
    "remaining_budget" DECIMAL(12,2) NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "headline" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impressions" (
    "id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "device_type" VARCHAR(50),
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impressions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" UUID NOT NULL,
    "impression_id" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advertisers_auth_user_id_key" ON "advertisers"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "advertisers_email_key" ON "advertisers"("email");

-- CreateIndex
CREATE INDEX "advertisers_auth_user_id_idx" ON "advertisers"("auth_user_id");

-- CreateIndex
CREATE INDEX "campaigns_advertiser_id_idx" ON "campaigns"("advertiser_id");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "impressions_campaign_id_timestamp_idx" ON "impressions"("campaign_id", "timestamp");

-- CreateIndex
CREATE INDEX "impressions_timestamp_idx" ON "impressions"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "clicks_impression_id_key" ON "clicks"("impression_id");

-- CreateIndex
CREATE INDEX "clicks_timestamp_idx" ON "clicks"("timestamp");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressions" ADD CONSTRAINT "impressions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_impression_id_fkey" FOREIGN KEY ("impression_id") REFERENCES "impressions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
