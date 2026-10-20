import { createCallerFactory, createTRPCRouter } from "~/libs/api/trpc";
import { bannerRouter } from "./routers/banner";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { userRouter } from "./routers/user";
import { webauthnRouter } from "./routers/webauthn";
import { permissionRouter } from "./routers/permissions";
import { configRouter } from "./routers/config";
import { userObjectRouter } from "./routers/user-object";
import { storeRouter } from "./routers/store";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  banner: bannerRouter,
  product: productRouter,
  category: categoryRouter,
  config: configRouter,
  user: userRouter,
  userObject: userObjectRouter,
  webauthn: webauthnRouter,
  permission: permissionRouter,
  store: storeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
