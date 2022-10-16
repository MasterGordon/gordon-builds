import { createRouter } from "../createRouter";
import superjson from "superjson";
import { buildsRouter } from "./builds";
import { dotaRouter } from "./dota";
import { dota2Router } from "./dota2";

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next }) => {
    // ctx.prisma.$disconnect();
    const resp = await next();
    // ctx.prisma.$connect();
    return resp;
  })
  .query("health", {
    async resolve() {
      return "yay!";
    },
  })
  .query("auth-test", {
    async resolve({ ctx }) {
      if (ctx.session?.user) return "yay!";
      return "nay!";
    },
  })
  /**
   * Merge `postRouter` under `post.`
   */
  .merge("build.", buildsRouter)
  .merge("dota.", dotaRouter)
  .merge("dota2.", dota2Router);

export type AppRouter = typeof appRouter;
