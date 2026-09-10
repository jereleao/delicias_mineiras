ALTER TABLE "de_mi_user" RENAME COLUMN "disablePasskey" TO "offerPasskey";--> statement-breakpoint
ALTER TABLE "de_mi_user" ALTER COLUMN "signedIn" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "de_mi_user" ALTER COLUMN "active" SET NOT NULL;