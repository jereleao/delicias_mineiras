CREATE TABLE "de_mi_config" (
	"code" varchar(256) PRIMARY KEY NOT NULL,
	"description" varchar(256),
	"value" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "config_code_idx" ON "de_mi_config" USING btree ("code");
--> statement-breakpoint
INSERT INTO "de_mi_permission" ("key", "description") VALUES
	('admin.configs', 'Read Configurations'),
	('admin.configs:edit', 'Edit Configurations'),
	('admin.configs:manage', 'Manage Configurations')
ON CONFLICT ("key") DO NOTHING;
--> statement-breakpoint
INSERT INTO "de_mi_role_permission" ("roleId", "permissionId")
SELECT role."id", permission."id"
FROM "de_mi_role" role
JOIN "de_mi_permission" permission ON permission."key" IN (
	'admin.configs:edit',
	'admin.configs:manage'
)
WHERE role."name" = 'admin'
ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "de_mi_config" ("code", "description", "value", "createdAt") VALUES
	('WHATS_NUMBER', 'Configured phone number to call via whats app', '11920135602', CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
INSERT INTO "de_mi_config" ("code", "description", "value", "createdAt") VALUES
	('WHATS_GREETING', 'Greenting message to call via whats', 'Olá como posso te ajudar?', CURRENT_TIMESTAMP)                 
ON CONFLICT ("code") DO NOTHING;