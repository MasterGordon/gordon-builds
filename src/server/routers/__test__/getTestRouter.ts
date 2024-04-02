import { createCallerFactory } from "@trpc/server";
import { appRouter } from "../_app";

export const getTestRouter = () => {
  const ctx = {};
  return createCallerFactory()(appRouter)(ctx);
};
