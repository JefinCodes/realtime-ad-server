-- DropIndex
DROP INDEX "campaigns_status_idx";

-- CreateIndex
CREATE INDEX "campaigns_status_start_date_end_date_idx" ON "campaigns"("status", "start_date", "end_date");
