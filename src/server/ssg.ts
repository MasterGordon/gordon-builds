import { createSSGHelpers } from "@trpc/react/ssg";
import { createContext } from "./context";
import { appRouter } from "./routes/_app";
import superjson from "superjson";

export const getSSG = async (context?: any) => {
  return createSSGHelpers({
    router: appRouter,
    ctx: await createContext(context ?? {}),
    transformer: superjson,
  });
};
