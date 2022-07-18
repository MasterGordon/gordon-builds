import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import Footer from "../components/Footer";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../server/routes/_app";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps;
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
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

export default withTRPC<AppRouter>({
  config: createConfig,
  ssr: false,
})(MyApp);
