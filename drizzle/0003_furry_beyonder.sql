ALTER TABLE "de_mi_user" ALTER COLUMN "roleId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "de_mi_banner" ADD COLUMN "active" boolean DEFAULT true;