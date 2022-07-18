import { createRouter } from "../createRouter";
import superjson from "superjson";
import { buildsRouter } from "./builds";
import { dotaRouter } from "./dota";

export const appRouter = createRouter()
  .transformer(superjson)
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
  .merge("dota.", dotaRouter);

export type AppRouter = typeof appRouter;
