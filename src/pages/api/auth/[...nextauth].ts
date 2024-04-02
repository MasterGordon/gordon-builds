import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import Steam, { PROVIDER_ID } from "next-auth-steam";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "../../../server/env";
import { getBaseUrl } from "../../_app";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const providers: AuthOptions["providers"] = [];
  if (env.NODE_ENV === "development") {
    providers.push(
      CredentialsProvider({
        name: "credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, _req) {
          const user = await prisma.user.findFirst({
            where: {
              name: credentials?.username,
              password: credentials?.password,
            },
          });

          return user;
        },
      })
    );
  }

  if (env.STEAM_SECRET) {
    providers.push(
      Steam(req, {
        clientSecret: env.STEAM_SECRET,
        callbackUrl: `${getBaseUrl()}/api/auth/callback`,
      })
    );
  }
  console.log(providers);

  return NextAuth(req, res, {
    providers,
    callbacks: {
      jwt: ({ token, account, profile }) => {
        if (account?.provider === PROVIDER_ID) {
          token.steam = profile;
        }
        return token;
      },
      session: ({ session, token }) => {
        // @ts-expect-error steam is not in the default session
        session.steam = token.steam;
        return session;
      },
    },
  });
}
