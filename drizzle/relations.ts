import { relations } from "drizzle-orm/relations";
import { deMiUser, deMiCategory, deMiProduct, deMiSession, deMiCredentials, deMiAccount } from "./schema";

export const deMiCategoryRelations = relations(deMiCategory, ({one, many}) => ({
	deMiUser: one(deMiUser, {
		fields: [deMiCategory.createdById],
		references: [deMiUser.id]
	}),
	deMiProducts: many(deMiProduct),
}));

export const deMiUserRelations = relations(deMiUser, ({many}) => ({
	deMiCategories: many(deMiCategory),
	deMiProducts: many(deMiProduct),
	deMiSessions: many(deMiSession),
	deMiCredentials: many(deMiCredentials),
	deMiAccounts: many(deMiAccount),
}));

export const deMiProductRelations = relations(deMiProduct, ({one}) => ({
	deMiCategory: one(deMiCategory, {
		fields: [deMiProduct.categoryId],
		references: [deMiCategory.id]
	}),
	deMiUser: one(deMiUser, {
		fields: [deMiProduct.createdById],
		references: [deMiUser.id]
	}),
}));

export const deMiSessionRelations = relations(deMiSession, ({one}) => ({
	deMiUser: one(deMiUser, {
		fields: [deMiSession.userId],
		references: [deMiUser.id]
	}),
}));

export const deMiCredentialsRelations = relations(deMiCredentials, ({one}) => ({
	deMiUser: one(deMiUser, {
		fields: [deMiCredentials.userId],
		references: [deMiUser.id]
	}),
}));

export const deMiAccountRelations = relations(deMiAccount, ({one}) => ({
	deMiUser: one(deMiUser, {
		fields: [deMiAccount.userId],
		references: [deMiUser.id]
	}),
}));