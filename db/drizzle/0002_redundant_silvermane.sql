ALTER TABLE "users" ALTER COLUMN "role_id" SET DEFAULT 'de7ee6c4-dda1-450c-b621-bb0426dd3521';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;