import { createTRPCRouter } from "./trpc";
import { albumRouter } from "./routers/album";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  album: albumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
