INSERT INTO "de_mi_permission" ("key", "description") VALUES
	('permissions', 'Read platform roles'),
	('permissions:edit', 'Edit platform roles'),
	('permissions:manage', 'Manage platform roles')
ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
INSERT INTO "de_mi_role_permission" ("roleId", "permissionId")
SELECT role."id", permission."id"
FROM "de_mi_role" role
JOIN "de_mi_permission" permission
	ON permission."key" IN (
		'permissions',
		'permissions:edit',
		'permissions:manage'
	)
WHERE role."storeId" IS NULL
	AND role."name" = 'admin'
ON CONFLICT DO NOTHING;
