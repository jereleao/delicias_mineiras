CREATE TABLE "de_mi_user_role" (
	"userId" varchar(255) NOT NULL,
	"roleId" integer NOT NULL,
	CONSTRAINT "de_mi_user_role_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
ALTER TABLE "de_mi_user" DROP CONSTRAINT "de_mi_user_roleId_de_mi_role_id_fk";
--> statement-breakpoint
DROP INDEX "role_name_idx";--> statement-breakpoint
ALTER TABLE "de_mi_role" ADD COLUMN "storeId" integer;--> statement-breakpoint
ALTER TABLE "de_mi_user_role" ADD CONSTRAINT "de_mi_user_role_userId_de_mi_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."de_mi_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "de_mi_user_role" ADD CONSTRAINT "de_mi_user_role_roleId_de_mi_role_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."de_mi_role"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_role_role_idx" ON "de_mi_user_role" USING btree ("roleId");--> statement-breakpoint
ALTER TABLE "de_mi_role" ADD CONSTRAINT "de_mi_role_storeId_de_mi_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."de_mi_store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "role_platform_name_idx" ON "de_mi_role" USING btree ("name") WHERE "de_mi_role"."storeId" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "role_store_name_idx" ON "de_mi_role" USING btree ("storeId","name") WHERE "de_mi_role"."storeId" is not null;--> statement-breakpoint
CREATE INDEX "role_store_idx" ON "de_mi_role" USING btree ("storeId");--> statement-breakpoint
ALTER TABLE "de_mi_user" DROP COLUMN "roleId";--> statement-breakpoint
INSERT INTO "de_mi_permission" ("key", "description")
SELECT 'store.' || substring("key" from 7), "description"
FROM "de_mi_permission"
WHERE "key" LIKE 'admin.%'
ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
INSERT INTO "de_mi_permission" ("key", "description") VALUES
	('users', 'Manage platform users'),
	('users:edit', 'Edit platform users'),
	('users:manage', 'Manage platform users'),
	('stores', 'Read stores'),
	('stores:edit', 'Edit stores'),
	('stores:manage', 'Manage stores')
ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
INSERT INTO "de_mi_role" ("storeId", "name", "description", "createdAt")
SELECT store."id", platform_role."name", platform_role."description", CURRENT_TIMESTAMP
FROM "de_mi_role" platform_role
CROSS JOIN "de_mi_store" store
WHERE platform_role."storeId" IS NULL;--> statement-breakpoint
INSERT INTO "de_mi_role_permission" ("roleId", "permissionId")
SELECT store_role."id", store_permission."id"
FROM "de_mi_role" platform_role
JOIN "de_mi_role" store_role
	ON store_role."name" = platform_role."name"
	AND store_role."storeId" IS NOT NULL
CROSS JOIN "de_mi_store" store
JOIN "de_mi_role_permission" source_assignment
	ON source_assignment."roleId" = platform_role."id"
JOIN "de_mi_permission" source_permission
	ON source_permission."id" = source_assignment."permissionId"
	AND source_permission."key" LIKE 'admin.%'
JOIN "de_mi_permission" store_permission
	ON store_permission."key" = 'store.' || substring(source_permission."key" from 7)
WHERE platform_role."storeId" IS NULL
	AND store_role."storeId" = store."id"
ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "de_mi_role_permission" ("roleId", "permissionId")
SELECT platform_role."id", permission."id"
FROM "de_mi_role" platform_role
JOIN "de_mi_permission" permission
	ON permission."key" IN (
		'users',
		'users:edit',
		'users:manage',
		'stores',
		'stores:edit',
		'stores:manage'
	)
WHERE platform_role."storeId" IS NULL
	AND platform_role."name" = 'admin'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
DELETE FROM "de_mi_permission"
WHERE "key" LIKE 'admin.%';