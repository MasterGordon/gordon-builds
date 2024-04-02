import { router } from "../trpc";
import { dota } from "./dota";

export const appRouter = router({
  dota,
});

export type AppRouter = typeof appRouter;
