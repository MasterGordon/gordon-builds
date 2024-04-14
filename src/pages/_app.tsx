import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Footer from "../components/Footer";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps;
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Header isSolid={(Component as any).isHeaderSolid ?? true} />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </SessionProvider>
  );
};

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.URL) {
    return `https://${process.env.URL}`;
  }

  return `http://localhost:${process.env.PORT ?? "3000"}`;
};

export const createConfig = () => ({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
  transformer: superjson,
});

export default trpc.withTRPC(MyApp);
