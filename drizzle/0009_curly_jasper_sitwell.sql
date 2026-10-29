CREATE TABLE "de_mi_store_branding" (
	"storeId" integer PRIMARY KEY NOT NULL,
	"metaDescription" text,
	"faviconUrl" text,
	"logoFullLight" text,
	"logoFullDark" text,
	"logoSmallLight" text,
	"logoSmallDark" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "store_branding_has_logo_check" CHECK ("de_mi_store_branding"."logoFullLight" IS NOT NULL
        OR "de_mi_store_branding"."logoFullDark" IS NOT NULL
        OR "de_mi_store_branding"."logoSmallLight" IS NOT NULL
        OR "de_mi_store_branding"."logoSmallDark" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "de_mi_store_branding" ADD CONSTRAINT "de_mi_store_branding_storeId_de_mi_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."de_mi_store"("id") ON DELETE cascade ON UPDATE no action;