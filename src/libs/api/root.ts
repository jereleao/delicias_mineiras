import { createCallerFactory, createTRPCRouter } from "~/libs/api/trpc";
import { bannerRouter } from "./routers/banner";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { userRouter } from "./routers/user";
import { webauthnRouter } from "./routers/webauthn";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  banner: bannerRouter,
  product: productRouter,
  category: categoryRouter,
  user: userRouter,
  webauthn: webauthnRouter,
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
